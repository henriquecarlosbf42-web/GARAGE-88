# Prompts — Garage 88

## Prompt Master

Criar um site pra **Garage 88** — hamburgueria artesanal em São José dos Campos.
O projeto é **pago**.

**Objetivo:** apresentar o estabelecimento (site institucional pra quem quer
conhecer a Garage 88) + um sistema com painel de gerenciamento de pedidos pra
uso da equipe, com integração a delivery/pagamento online.

**Tom:** premium/artesanal — foco em qualidade e processo artesanal do
hambúrguer, visual cuidado e sofisticado (não descolado/informal).

**Público-alvo:** moradores e visitantes de São José dos Campos que curtem
hambúrguer artesanal — tanto quem vai comer no local quanto quem pede delivery.

**Identidade visual (ponto de partida):** ainda não definida — depende de
prints/fotos reais do Instagram @garage88.ne (Instagram bloqueia scraping
direto do link). **Pendente pra Etapa 1.**

**Estrutura da página (fechada na Etapa 3):**
- Hero (nome, chamada principal, foto de destaque, CTA "Pedir agora" já visível)
- Cardápio (logo após o Hero — mostrar o produto rápido, prioriza conversão)
- Sobre / história da Garage 88
- Localização e horário de funcionamento
- Contato e redes sociais
- CTA "Pedir agora" fixo (sticky button) acompanhando a rolagem, em vez de seção isolada

**Referências visuais:** https://www.instagram.com/garage88.ne/ (acesso
limitado — pedir prints da bio, feed e 2-3 fotos representativas)

---

## Stack técnica

- Frontend: framework a definir na Etapa 4 (provável Next.js, por causa do
  Supabase + painel dinâmico — landing estática pura não cobre esse caso)
- Backend/dados: Supabase (banco de dados, e possivelmente auth pro painel)
- Deploy: Vercel
- Painel de pedidos: uso da equipe interna + integração com delivery/pagamento
  online (escopo exato da integração ainda em aberto — ver briefing.md)

> Nota: como o projeto usa Supabase e painel dinâmico, o deploy na Etapa 7
> NÃO vai usar o truque `vercel.json` com `framework: null` (isso é só pra
> HTML estático). A Vercel vai detectar o framework escolhido normalmente.

### O que já foi construído (Etapa 4)

- App Next.js (App Router, TypeScript, Tailwind v4) criado dentro da própria
  pasta do projeto — vai virar o repositório próprio na Etapa 7
- Site (`/`): Header com CTA fixo, Hero, Cardápio (itens placeholder),
  Sobre, Pedir agora, Localização, Contato — seguindo a identidade
  provisória e os textos do `copywriting.md`
- Painel (`/painel`): protegido por autenticação Supabase (login em
  `/painel/login`, middleware redireciona quem não está logado). Lista
  pedidos e permite atualizar status
- `supabase/schema.sql`: schema da tabela `pedidos` + políticas de acesso
  (RLS) — precisa ser rodado no Supabase antes de usar o painel de verdade
- `.env.local.example`: template das variáveis de ambiente do Supabase
- Build de produção (`npm run build`) passando sem erros

### Pendente antes do deploy (Etapa 7)

- [x] Preencher `.env.local` com URL + anon key do projeto Supabase real
- [x] Rodar `supabase/schema.sql` no projeto Supabase (tabela confirmada via API)
- [x] Criar usuário da equipe em Authentication → Users no Supabase (login testado com sucesso)
- [ ] Definir fluxo real de "Pedir agora" (form próprio vs. integração
      delivery/WhatsApp) — hoje é só um placeholder de CTA
- [x] Pedido fictício criado no banco pra teste (visível no painel)
- [x] Papéis separados: admin (cozinha/gestão, painel `/painel`) vs motoboy
      (painel `/painel/motoboy`) — motoboy só vê pedidos "em preparo" sem
      dono ou os que ele mesmo pegou; não vê histórico nem cria pedidos.
      Papel fica na tabela `profiles`, novo usuário nasce "admin" por
      padrão — pra virar motoboy, rodar depois de criar o login dele:
      `update public.profiles set role = 'motoboy' where id = '<uuid>';`
- [~] IMPORTANTE (achado durante o teste): inserts feitos pelo `anon` (site
      público) precisam usar `Prefer: return=minimal` / não encadear
      `.select()` no supabase-js — pedir o registro de volta (`RETURNING`)
      falha por RLS, porque `anon` não tem política de SELECT na tabela
      `pedidos`. Isso vai importar quando construirmos o form real de
      pedido e o rastreamento pro cliente (próxima etapa combinada)

---

## Etapas (status)

- [x] Etapa 0 — Projeto criado
- [x] Prompt Master — preenchido (identidade visual pendente)
- [x] Etapa 1 — Referências e identidade visual (provisória, ver identidade/design-guide.md)
- [x] Etapa 2 — Copywriting (com placeholders, ver copywriting.md)
- [x] Etapa 3 — Estrutura e wireframe (Hero → Cardápio → Sobre → Localização → Contato, CTA sticky)
- [x] Etapa 4 — Desenvolvimento (Next.js + Tailwind + Supabase, build passando; ver detalhes técnicos abaixo)
- [~] Etapa 5 — Conteúdo real (parcial: cardápio com nomes reais, horário real; endereço, whatsapp, descrições/preços e fotos ainda pendentes — cliente vai mandar depois)
- [ ] Etapa 6 — Contato/ação final
- [x] Etapa 7 — Deploy (no ar em https://garage-88.vercel.app, repo em github.com/henriquecarlosbf42-web/GARAGE-88)
