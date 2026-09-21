# Garage 88

Site institucional + painel de gerenciamento de pedidos da Garage 88
(hamburgueria artesanal, São José dos Campos).

## Stack

- [Next.js](https://nextjs.org) (App Router)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com) (banco de dados + autenticação do painel)
- Deploy: [Vercel](https://vercel.com)

## Setup local

```bash
npm install
cp .env.local.example .env.local
# preencher NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Antes de usar o painel (`/painel`), rodar `supabase/schema.sql` no SQL Editor
do projeto Supabase — cria a tabela `pedidos` e as políticas de acesso.
Os usuários da equipe (login do painel) são criados em Authentication →
Users no Supabase Dashboard.

## Estrutura

- `src/app/page.tsx` — site institucional (Hero, Cardápio, Sobre,
  Localização, Contato)
- `src/app/painel/` — painel de pedidos (login + lista protegida por
  autenticação)
- `src/lib/supabase/` — clientes Supabase (browser, server, middleware)
- `supabase/schema.sql` — schema do banco de dados

## Documentação do projeto

- `briefing.md` — briefing do cliente
- `prompts.md` — Prompt Master e status das etapas
- `copywriting.md` — textos do site
- `identidade/design-guide.md` — paleta e identidade visual
