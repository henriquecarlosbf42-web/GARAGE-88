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
  created_at timestamptz not null default now()
);

-- Rodando de novo num banco que já tem a tabela (sem essas colunas)?
-- Essas duas linhas adicionam o que faltar, sem dar erro se já existir.
alter table public.pedidos add column if not exists endereco_entrega text;
alter table public.pedidos add column if not exists taxa_entrega numeric(10, 2);

-- Tabelas criadas via SQL Editor (em vez do Table Editor) nao ganham grant
-- automatico pros papeis anon/authenticated -- precisa liberar explicitamente
-- (as politicas de RLS abaixo continuam controlando o que cada um ve/edita).
grant usage on schema public to anon, authenticated;
grant insert on public.pedidos to anon;
grant select, update on public.pedidos to authenticated;

alter table public.pedidos enable row level security;

-- drop policy if exists antes de cada create: torna seguro rodar esse
-- arquivo mais de uma vez sem dar erro de "policy already exists".

-- Qualquer pessoa (site público) pode CRIAR um pedido.
drop policy if exists "Qualquer um pode criar pedido" on public.pedidos;
create policy "Qualquer um pode criar pedido"
  on public.pedidos for insert
  to anon, authenticated
  with check (true);

-- Só usuários autenticados (equipe, logada no painel) podem VER e ATUALIZAR pedidos.
drop policy if exists "Equipe autenticada pode ver pedidos" on public.pedidos;
create policy "Equipe autenticada pode ver pedidos"
  on public.pedidos for select
  to authenticated
  using (true);

drop policy if exists "Equipe autenticada pode atualizar pedidos" on public.pedidos;
create policy "Equipe autenticada pode atualizar pedidos"
  on public.pedidos for update
  to authenticated
  using (true)
  with check (true);

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
