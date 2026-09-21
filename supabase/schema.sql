-- Rodar no SQL Editor do Supabase (Dashboard do projeto) antes de usar o painel.

create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  cliente_nome text not null,
  cliente_telefone text,
  itens text not null,
  observacoes text,
  status text not null default 'novo'
    check (status in ('novo', 'em_preparo', 'saiu_para_entrega', 'concluido', 'cancelado')),
  origem text not null default 'site'
    check (origem in ('site', 'whatsapp', 'delivery')),
  valor_total numeric(10, 2),
  created_at timestamptz not null default now()
);

alter table public.pedidos enable row level security;

-- Qualquer pessoa (site público) pode CRIAR um pedido.
create policy "Qualquer um pode criar pedido"
  on public.pedidos for insert
  to anon, authenticated
  with check (true);

-- Só usuários autenticados (equipe, logada no painel) podem VER e ATUALIZAR pedidos.
create policy "Equipe autenticada pode ver pedidos"
  on public.pedidos for select
  to authenticated
  using (true);

create policy "Equipe autenticada pode atualizar pedidos"
  on public.pedidos for update
  to authenticated
  using (true)
  with check (true);

-- Criar os usuários da equipe em Authentication → Users no Supabase Dashboard
-- (convite por email, não tem cadastro público no painel).
