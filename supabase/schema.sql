-- Rodar no SQL Editor do Supabase (Dashboard do projeto) antes de usar o painel.

create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  cliente_nome text not null,
  cliente_telefone text,
  endereco_entrega text,
  itens text not null,
  observacoes text,
  status text not null default 'novo'
    check (status in ('novo', 'em_preparo', 'saiu_para_entrega', 'concluido', 'cancelado')),
  origem text not null default 'site'
    check (origem in ('site', 'whatsapp', 'delivery')),
  valor_total numeric(10, 2),
  taxa_entrega numeric(10, 2),
  forma_pagamento text check (forma_pagamento in ('dinheiro', 'cartao', 'pix')),
  created_at timestamptz not null default now()
);

-- Rodando de novo num banco que já tem a tabela (sem essas colunas)?
-- Essas linhas adicionam o que faltar, sem dar erro se já existir.
alter table public.pedidos add column if not exists endereco_entrega text;
alter table public.pedidos add column if not exists taxa_entrega numeric(10, 2);
alter table public.pedidos add column if not exists motoboy_id uuid references auth.users(id);
alter table public.pedidos add column if not exists forma_pagamento text;
alter table public.pedidos drop constraint if exists pedidos_forma_pagamento_check;
alter table public.pedidos add constraint pedidos_forma_pagamento_check
  check (forma_pagamento in ('dinheiro', 'cartao', 'pix'));
alter table public.pedidos add column if not exists latitude double precision;
alter table public.pedidos add column if not exists longitude double precision;

-- Papel de cada usuário da equipe: 'admin' (cozinha/gestão, vê tudo) ou
-- 'motoboy' (só vê pedidos prontos pra pegar ou que ele mesmo pegou).
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin', 'motoboy')),
  nome text,
  created_at timestamptz not null default now()
);

grant select on public.profiles to authenticated;
alter table public.profiles enable row level security;

drop policy if exists "Usuario ve o proprio perfil" on public.profiles;
create policy "Usuario ve o proprio perfil"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

-- Todo usuário novo criado em Authentication -> Users vira 'admin' por
-- padrão. Pra transformar alguém em motoboy, depois de criar o login dele,
-- rodar: update public.profiles set role = 'motoboy' where id = '<uuid do usuario>';
-- (o uuid aparece na tela de Authentication -> Users, ao abrir o usuário)
create or replace function public.criar_perfil_novo_usuario()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, nome)
  values (new.id, 'admin', new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.criar_perfil_novo_usuario();

-- Cria o perfil de quem já tinha usuário criado antes dessa tabela existir.
insert into public.profiles (id, role, nome)
select id, 'admin', email from auth.users
on conflict (id) do nothing;

-- Tabelas criadas via SQL Editor (em vez do Table Editor) nao ganham grant
-- automatico pros papeis anon/authenticated -- precisa liberar explicitamente
-- (as politicas de RLS abaixo continuam controlando o que cada um ve/edita).
grant usage on schema public to anon, authenticated;
grant insert on public.pedidos to anon;
grant select, insert, update on public.pedidos to authenticated;

alter table public.pedidos enable row level security;

-- drop policy if exists antes de cada create: torna seguro rodar esse
-- arquivo mais de uma vez sem dar erro de "policy already exists".

-- Qualquer visitante do site (anon) pode criar um pedido. Da equipe
-- logada, só admin pode criar pedido manualmente (motoboy não deveria).
drop policy if exists "Qualquer um pode criar pedido" on public.pedidos;
drop policy if exists "Anon ou admin pode criar pedido" on public.pedidos;
create policy "Anon ou admin pode criar pedido"
  on public.pedidos for insert
  to anon, authenticated
  with check (
    auth.role() = 'anon'
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admin (cozinha/gestão) vê e atualiza TODOS os pedidos.
drop policy if exists "Equipe autenticada pode ver pedidos" on public.pedidos;
drop policy if exists "Admin ve todos os pedidos" on public.pedidos;
create policy "Admin ve todos os pedidos"
  on public.pedidos for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

drop policy if exists "Equipe autenticada pode atualizar pedidos" on public.pedidos;
drop policy if exists "Admin atualiza qualquer pedido" on public.pedidos;
create policy "Admin atualiza qualquer pedido"
  on public.pedidos for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Motoboy só vê pedidos prontos e ainda sem ninguém (pra escolher pegar) ou
-- os que ele mesmo já pegou (pra acompanhar as próprias entregas).
drop policy if exists "Motoboy ve pedidos prontos ou proprios" on public.pedidos;
create policy "Motoboy ve pedidos prontos ou proprios"
  on public.pedidos for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'motoboy'
    )
    and (
      (status = 'em_preparo' and motoboy_id is null)
      or motoboy_id = auth.uid()
    )
  );

drop policy if exists "Motoboy atualiza pedidos visiveis" on public.pedidos;
create policy "Motoboy atualiza pedidos visiveis"
  on public.pedidos for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'motoboy'
    )
    and (
      (status = 'em_preparo' and motoboy_id is null)
      or motoboy_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'motoboy'
    )
  );

-- Criar os usuários da equipe em Authentication → Users no Supabase Dashboard
-- (convite por email, não tem cadastro público no painel).

-- Rastreamento público do pedido (cliente abre um link com o id do pedido,
-- sem precisar de login). Em vez de abrir uma política de SELECT geral pro
-- "anon" (que exporia nome/telefone/endereço de TODOS os pedidos pra
-- qualquer um), essa função devolve só os campos de status de UM pedido
-- específico -- o id já funciona como "senha" (é um UUID, não dá pra
-- adivinhar).
create or replace function public.pedido_status(pedido_id uuid)
returns table (
  status text,
  itens text,
  valor_total numeric,
  created_at timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select status, itens, valor_total, created_at
  from public.pedidos
  where id = pedido_id;
$$;

grant execute on function public.pedido_status(uuid) to anon, authenticated;

-- ====================================================
-- CARDÁPIO (categorias + produtos)
-- ====================================================

create table if not exists public.categorias (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  ordem int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.produtos (
  id uuid primary key default gen_random_uuid(),
  categoria_id uuid references public.categorias(id) on delete set null,
  nome text not null,
  descricao text,
  ingredientes text,
  preco numeric(10, 2),
  imagem_url text,
  disponivel boolean not null default true,
  ordem int not null default 0,
  created_at timestamptz not null default now()
);

grant usage on schema public to anon, authenticated;
grant select on public.categorias to anon, authenticated;
grant insert, update, delete on public.categorias to authenticated;
grant select on public.produtos to anon, authenticated;
grant insert, update, delete on public.produtos to authenticated;

alter table public.categorias enable row level security;
alter table public.produtos enable row level security;

-- Categorias: todo mundo ve, so admin mexe.
drop policy if exists "Categorias sao publicas" on public.categorias;
create policy "Categorias sao publicas"
  on public.categorias for select
  to anon, authenticated
  using (true);

drop policy if exists "Admin gerencia categorias" on public.categorias;
create policy "Admin gerencia categorias"
  on public.categorias for all
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Produtos: visitante do site (anon) so ve os disponiveis; admin ve e edita tudo.
drop policy if exists "Produtos disponiveis sao publicos" on public.produtos;
create policy "Produtos disponiveis sao publicos"
  on public.produtos for select
  to anon
  using (disponivel = true);

drop policy if exists "Admin ve todos os produtos" on public.produtos;
create policy "Admin ve todos os produtos"
  on public.produtos for select
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "Admin gerencia produtos" on public.produtos;
create policy "Admin gerencia produtos"
  on public.produtos for all
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Bucket de imagens dos produtos (publico pra leitura, so admin escreve).
insert into storage.buckets (id, name, public)
values ('produtos', 'produtos', true)
on conflict (id) do nothing;

drop policy if exists "Imagens de produtos sao publicas" on storage.objects;
create policy "Imagens de produtos sao publicas"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'produtos');

drop policy if exists "Admin gerencia imagens de produtos" on storage.objects;
create policy "Admin gerencia imagens de produtos"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'produtos'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  )
  with check (
    bucket_id = 'produtos'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
