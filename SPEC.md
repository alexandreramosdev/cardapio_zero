# SPEC.md — Cardápio Zero (v1)

Documento de referência da primeira versão. Mudanças de escopo devem ser refletidas aqui e em `TASKS.md`.

## 1. Objetivo

Construir um SaaS de cardápio digital para hamburguerias e restaurantes pequenos, permitindo:

- Ao dono do restaurante, gerenciar categorias, produtos e pedidos em um painel administrativo.
- Ao cliente final, acessar um cardápio público mobile-first pelo link do estabelecimento, montar um carrinho e enviar o pedido sem instalar aplicativo.

Princípios: começar enxuto, uma única linguagem (TypeScript) em todo o stack, custo zero de infraestrutura no início (Vercel + Neon), evoluir sem refazer a base.

Projeto de portfólio full-stack: o código deve demonstrar domínio de Next.js App Router, modelagem relacional com Prisma, autenticação com Auth.js e Server Actions com validação.

## 2. Público-alvo

- **Admin (dono do restaurante):** gerencia o cardápio e acompanha pedidos pelo painel.
- **Visitante (cliente final):** acessa o cardápio público pelo celular, monta o carrinho e envia o pedido.

## 3. Escopo da v1

| Rota | Descrição |
|---|---|
| `/` | Landing de apresentação do produto com link para o cardápio demo e para o login do admin. |
| `/login` | Autenticação do admin (e-mail e senha). |
| `/admin` | Painel: visão geral com atalhos para as áreas. |
| `/admin/categories` | CRUD de categorias. |
| `/admin/products` | CRUD de produtos (substitui o formulário estático atual). |
| `/admin/orders` | Lista de pedidos e atualização de status. |
| `/admin/settings` | Dados do restaurante (nome, slug, WhatsApp, descrição). |
| `/r/[slug]` | Cardápio público do restaurante, mobile-first. |

Na v1, cada usuário admin possui exatamente um restaurante (1:1). O provisionamento do admin é feito por seed/script — não há cadastro público.

## 4. Requisitos funcionais

| ID | Requisito |
|---|---|
| RF-01 | Landing em `/` apresenta o produto, link para o cardápio demo e acesso ao login; metadados de SEO básicos (`lang="pt-BR"`, título e descrição únicos). |
| RF-02 | Autenticação do admin com Auth.js (provider de credenciais: e-mail + senha com hash), sessão persistida no PostgreSQL via `@auth/prisma-adapter` e cookie `httpOnly`. Sem cadastro público na v1; usuário admin criado por seed. |
| RF-03 | Todas as rotas `/admin/*` são inacessíveis sem sessão válida: redirecionam para `/login`, preservando o destino original após autenticar. |
| RF-04 | CRUD de categorias: criar, renomear, reordenar e excluir (exclusão bloqueada se houver produtos vinculados, com mensagem explicativa). |
| RF-05 | CRUD de produtos: nome, descrição, preço (armazenado em centavos), URL de imagem externa, categoria e disponibilidade (`available`). Produto indisponível não pode ser comprado. |
| RF-06 | Configurações do restaurante: nome, slug (único, URL-safe, validado) e WhatsApp opcional. Alterar o slug muda a URL pública. |
| RF-07 | Cardápio público em `/r/[slug]`: mobile-first, produtos agrupados por categoria na ordem definida; produto indisponível aparece como esgotado e sem botão de adicionar; slug inexistente retorna 404. |
| RF-08 | Carrinho client-side: adicionar, alterar quantidade e remover itens; subtotal e contagem atualizados; persistência em `localStorage`; estado vazio com chamada para voltar ao cardápio. |
| RF-09 | Checkout: nome do cliente (obrigatório) e observação (opcional); grava `Order` + `OrderItem` no PostgreSQL com status inicial `PENDING` e total calculado no servidor a partir dos preços persistidos; tela de confirmação com resumo do pedido. Sem pagamento online. |
| RF-10 | Lista de pedidos no admin: itens, total, dados do cliente e data; atualização de status entre `PENDING`, `CONFIRMED`, `DELIVERED` e `CANCELED`. |
| RF-11 | Toda mutação (Server Actions) valida sessão do admin ou dados do checkout com Zod antes de gravar; erros retornam mensagens claras ao formulário. |

## 5. Requisitos não funcionais

- **Desempenho:** React Server Components por padrão; JavaScript no cliente restrito ao carrinho e interações do admin; imagens externas renderizadas via `next/image` com `remotePatterns` documentados; NEON no plano gratuito.
- **Acessibilidade:** HTML semântico, labels em todos os campos, navegação por teclado, foco visível, contraste adequado, `aria` no carrinho e nas mensagens de erro; alvo WCAG 2.1 AA essencial.
- **Responsividade:** mobile-first, funcionando de 320px a telas amplas; o cardápio público é prioridade de experiência mobile.
- **Segurança:** senhas com hash (bcrypt), sessões em banco, cookies `httpOnly`/`sameSite`, validação server-side com Zod em toda entrada, nenhuma credencial versionada (`.env` fora do Git; `.env.example` sem segredos), preço e total sempre calculados no servidor.
- **Custo:** hospedagem e banco exclusivamente gratuitos (Vercel + Neon).
- **Manutenibilidade:** TypeScript strict, ESLint sem erros, separação entre área pública, admin e camada de dados; documentação em `README.md`, `SPEC.md` e `TASKS.md`.

## 6. Fora de escopo (v1)

- Cadastro público de restaurantes (multi-tenant self-service) — v1 tem um restaurante por admin, provisionado por seed.
- Pagamento online e integração com gateways.
- Upload de imagem — v1 usa URL externa; upload (ex.: Vercel Blob) fica para versão futura.
- Notificações automáticas (e-mail/WhatsApp) para o restaurante ao receber pedido.
- Cálculo de entrega, taxas, cupons, agenda de funcionamento e i18n.
- Testes E2E automatizados (validação manual documentada nesta v1).

## 7. Modelo de dados (Prisma)

Tabelas do Auth.js (padrão do `@auth/prisma-adapter`):

- `User` — `id`, `name`, `email` (único), `passwordHash`, `createdAt`.
- `Account`, `Session`, `VerificationToken` — exigidas pelo adapter; sessão de banco.

Domínio:

- `Restaurant` — `id`, `name`, `slug` (único), `description?`, `whatsapp?`, `ownerId` (único, 1:1 com `User`).
- `Category` — `id`, `name`, `sortOrder`, `restaurantId`; nome único por restaurante (`@@unique([restaurantId, name])`).
- `Product` — `id`, `name`, `description?`, `priceCents` (Int), `imageUrl?`, `available` (Bool, padrão `true`), `categoryId`, `restaurantId`; nome único por categoria (`@@unique([categoryId, name])`).
- `Order` — `id`, `customerName`, `note?`, `status` (enum `PENDING`/`CONFIRMED`/`DELIVERED`/`CANCELED`), `totalCents`, `createdAt`, `restaurantId`.
- `OrderItem` — `id`, `orderId`, `productId?` (`SetNull` na exclusão do produto — o histórico é preservado pelo snapshot), `productName` e `unitPriceCents` (snapshot do momento do pedido), `quantity`.

## 8. Arquitetura

- **Stack:** Next.js 15 (App Router, Turbopack) + React 19 + TypeScript strict + Tailwind CSS v4 + shadcn/ui; Prisma 6 com PostgreSQL (Neon); Auth.js com credentials + `@auth/prisma-adapter`; Zod para validação.
- **Estrutura alvo:**
  - `src/app/(public)/` — landing e cardápio público `/r/[slug]`.
  - `src/app/login/` — autenticação.
  - `src/app/admin/` — rotas protegidas; cada área com `actions.ts` (Server Actions) e componentes de formulário.
  - `src/components/ui/` — shadcn/ui; `src/components/` — componentes de domínio (cardápio, carrinho, pedido).
  - `src/lib/prisma.ts` — client singleton; `src/lib/auth.ts` — configuração Auth.js; `src/lib/validators.ts` — schemas Zod.
  - `prisma/schema.prisma` + `prisma/seed.ts` — schema e seed do admin/restaurante demo.
- **Client Prisma:** gerado em `src/generated/prisma` (já configurado; ignorado no Git).
- **Migrations:** `prisma migrate dev` em desenvolvimento; `prisma migrate deploy` na Vercel. Com pooling Neon, migrations usam `DIRECT_URL`.
- **Deploy:** Vercel (aplicação) + Neon (PostgreSQL), ambos em plano gratuito.

## 9. Estado atual vs. requisitos

| Item | Situação |
|---|---|
| Scaffold Next.js 15 + TS strict + Tailwind v4 + shadcn/ui | Pronto (herdado do create-next-app e configurado) |
| Prisma instalado e apontando para Neon | Parcial — `schema.prisma` sem nenhum model |
| Formulário `/admin/products` | Parcial — apenas UI estática, sem ação, sem persistência e sem proteção |
| Landing `/` | Pendente — `page.tsx` ainda é o template padrão do Next |
| Autenticação, carrinho, cardápio público, pedidos | Pendentes — escopo desta v1 |
| `package.json` com nome antigo (`cardapio_online`) | Corrigido para `cardapio-zero` nesta organização |

## 10. Critérios de aceitação

- Fluxo completo funciona: login → criar categoria e produto → produto visível em `/r/[slug]` → adicionar ao carrinho → checkout → pedido aparece em `/admin/orders` com status, e o status pode ser atualizado.
- `/admin/*` redireciona para `/login` quando não autenticado.
- Produto esgotado não pode ser adicionado ao carrinho; total do pedido é recalculado no servidor.
- `npm run lint` e `npm run build` executam sem erros.
- Nenhum segredo no repositório; `.env.example` documenta `DATABASE_URL`, `DIRECT_URL` e `AUTH_SECRET`.
- Cardápio público utilizável em tela de 320px, acessível por teclado.
- README explica execução, variáveis de ambiente, seed e deploy; limitações registradas.

## 11. Riscos e decisões pendentes

| Item | Situação |
|---|---|
| Auth.js v5 (`next-auth@beta`) | Decisão tomada — necessária para Next 15 + React 19; registrar versão exata no `package.json` ao instalar |
| Sessão de banco vs. JWT | Em revisão (T06) — Auth.js v5 com provider de credenciais não suporta estratégia `database`; manter sessão em banco exigiria trocar o método de login |
| Imagens | Decisão tomada — URL externa na v1; `remotePatterns` do `next/image` configurados conforme uso |
| Pooling Neon | Resolvido — `directUrl` configurado no schema; migration `init` aplicada via conexão direta (T04) |
| Seed do admin/restaurante demo | Pendente — script `prisma/seed.ts` com dados fictícios rotulados como demo |
| Upload de imagem, pagamento, notificações | Fora de escopo — versões futuras (ver seção 6) |
