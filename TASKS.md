# TASKS.md — Cardápio Zero

Status: `[ ]` pendente · `[~]` em andamento · `[x]` concluído

## Fundação

- [x] T01 — Scaffold Next.js 15 + TypeScript strict + Tailwind v4 + shadcn/ui (herdado do repositório)
- [x] T02 — Prisma conectado ao PostgreSQL/Neon (schema sem models)
- [x] T03 — Organização do repositório: `SPEC.md`, `TASKS.md`, `.env.example` e README corrigidos (nome `cardapio-zero`)
- [x] T04 — Models Prisma (Auth.js: `User`/`Account`/`Session`/`VerificationToken`; domínio: `Restaurant`/`Category`/`Product`/`Order`/`OrderItem`) + `prisma migrate dev`
- [ ] T05 — `prisma/seed.ts`: admin com senha hasheada + restaurante demo (dados rotulados como fictícios)

## Autenticação

- [ ] T06 — Auth.js (credentials) + `@auth/prisma-adapter` + bcrypt; página `/login` com validação Zod
- [ ] T07 — Proteção de `/admin/*` (redireciona para `/login` preservando destino) e logout

## Admin

- [ ] T08 — Layout do painel `/admin` com navegação (categorias, produtos, pedidos, configurações)
- [ ] T09 — CRUD de categorias (criar, renomear, reordenar; exclusão bloqueada com produtos vinculados)
- [ ] T10 — CRUD de produtos (substitui o formulário estático): preço em centavos, URL de imagem, categoria, disponibilidade
- [ ] T11 — Configurações do restaurante: nome, slug único validado, WhatsApp e descrição
- [ ] T12 — Lista de pedidos com itens, total e cliente + atualização de status (`PENDING`/`CONFIRMED`/`DELIVERED`/`CANCELED`)

## Público

- [ ] T13 — Landing `/` com apresentação, link para o cardápio demo e acesso ao admin
- [ ] T14 — Cardápio público `/r/[slug]` mobile-first: categorias na ordem definida, esgotados sem botão de adicionar, 404 para slug inexistente
- [ ] T15 — Carrinho client-side: adicionar/alterar/remover, subtotal, contagem, persistência em `localStorage`, estado vazio
- [ ] T16 — Checkout: nome do cliente + observação; Server Action grava `Order`/`OrderItem` com total recalculado no servidor; tela de confirmação

## Qualidade e entrega

- [ ] T17 — Zod em todos os formulários e Server Actions; mensagens de erro claras e acessíveis
- [ ] T18 — Acessibilidade: labels, teclado, foco visível, `aria` no carrinho; teste manual no cardápio público em 320px
- [ ] T19 — `npm run lint` (0 erros) + `npm run build` + fluxo completo validado manualmente (login → CRUD → pedido → status)
- [ ] T20 — README final: execução, `.env`, seed, migrations, deploy Vercel + Neon e limitações

## Pendências do proprietário (não bloqueiam o desenvolvimento)

- [ ] P01 — Criar banco no Neon (produção) e configurar `DATABASE_URL`/`DIRECT_URL` na Vercel
- [ ] P02 — Gerar `AUTH_SECRET` (ex.: `npx auth secret`) e definir e-mail/senha do admin no seed
- [ ] P03 — Definir nome e slug reais do restaurante demo e o WhatsApp, se houver
- [ ] P04 — Captura de tela/GIF do cardápio público para o README (substituir placeholder de preview)
- [ ] P05 — Deploy na Vercel + primeiro acesso em produção
