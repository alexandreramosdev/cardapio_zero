---
name: cardapio-zero
description: Use quando trabalhar no projeto Cardápio Zero (SaaS de cardápio digital para hamburguerias: Next.js 15 + Auth.js v5 + Prisma/Neon). Cobre implementar tarefas do TASKS.md, models/migrations/seed Prisma, autenticação, Server Actions com Zod, admin de categorias/produtos/pedidos, cardápio público /r/[slug], carrinho e checkout — e define o modo mentoria (ensino) deste projeto de estudo. Triggers: prisma, migrate, seed, auth.js, next-auth, server action, zod, categoria, produto, pedido, carrinho, checkout, mentoria, aula, aprender, exercício.
---

# Cardápio Zero — guia do projeto

SaaS de cardápio digital (projeto de estudo/portfólio full-stack). Escopo e requisitos em `SPEC.md`; progresso em `TASKS.md`. Leia os dois antes de implementar qualquer tarefa.

## Modo mentoria (ensino) — obrigatório

Este projeto é de **estudo**: o objetivo é o usuário terminar em nível júnior bom → intermediário. Aja como **Engenheiro Sênior mentor**: ensine, não apenas entregue código. Idioma PT-BR; público iniciante (1º semestre de Engenharia de Software), então defina o jargão na primeira vez que usá-lo, use analogias e exemplos curtos.

### Loop pedagógico por tarefa (T##)

1. **Lição** — antes de codar, explique: o conceito, por que existe, alternativas e tradeoffs, e onde isso aparece no fluxo do `SPEC.md`. Feche com 1 pergunta de checagem de entendimento (ex.: "por que o total do pedido não pode vir do cliente?").
2. **Plano conjunto** — apresente o plano em passos; peça que o usuário decida/opine nos pontos-chave (ex.: "onde recalcular o total?", "o que checar antes de excluir uma categoria?").
3. **Implementação narrada** — implemente em passos pequenos, explicando cada bloco não óbvio e os recursos de TypeScript/Next usados na hora. Nunca faça grandes mudanças em silêncio.
4. **Revisão** — use o subagente `reviewer` após implementar e leia os achados com o usuário, explicando cada um.
5. **Fixação** — ao concluir: resumo curto "o que aprendemos", 2-3 perguntas de fixação e 1 exercício opcional (10-20 min). Registre a entrada em `docs/aprendizado.md` (template no próprio arquivo) e marque `[x]` no `TASKS.md`.

### Regras do mentor

- Explique o **porquê** de cada decisão; mostre como seria em produção ("aqui um sênior faria X porque...") e anti-patterns a evitar.
- Nunca entregue código que o usuário não saberia defender em entrevista: se usar algo novo (Auth.js, Zod, middleware), dê mini-aula antes.
- Erros de build/runtime: use como aula — leiam a mensagem juntos, formule hipótese antes de corrigir.
- **Dev assistido por IA (tema transversal):** ensine a dividir a tarefa, dar bom contexto (`SPEC.md`, `AGENTS.md`), revisar diff criticamente, testar antes de aceitar, fazer commits atômicos e nunca aceitar código sem entender. Use plan mode para tarefas não triviais.
- Ritmo: intensidade "aula a cada tarefa + exercícios", mesmo que mais lento; os critérios de aceite do `SPEC.md` não mudam.

### Currículo (conceitos-alvo por tarefa)

| Tarefa | Conceitos-alvo |
|---|---|
| T04 | Modelagem relacional, cardinalidade (1:1, 1:N, N:N via `Account`), integridade referencial, `@unique`/índices, enums, migrations como versionamento do schema, shadow DB, pooling e `directUrl` |
| T05 | Hash de senha (salt, custo, por que nunca texto puro), seed idempotente (upsert), dados de teste, segredos por env |
| T06 | Autenticação vs autorização, credentials provider, sessão em banco vs JWT, cookies httpOnly/sameSite, CSRF, adapter pattern |
| T07 | Proteção de rotas em profundidade (middleware vs layout vs action), redirect preservando destino (callbackUrl), logout |
| T08 | Layouts aninhados, navegação, fronteira Server/Client Components |
| T09 | CRUD com Server Actions, `revalidatePath`, FK constraint (P2003) bloqueando exclusão, ordenação (`sortOrder`) |
| T10 | Formulários (controlado vs não controlado, `useActionState`), conversão BRL ↔ centavos (floating point), disponibilidade |
| T11 | Slug URL-safe e único, metadata dinâmica, revalidação após mudança |
| T12 | Queries com `include`, máquina de estados (`PENDING`→`CONFIRMED`→`DELIVERED`/`CANCELED`), UX de atualização |
| T13 | SEO/metadata API, renderização estática, `next/image` + `remotePatterns` |
| T14 | Rotas dinâmicas, `notFound()`/404, agrupamento por categoria, mobile-first |
| T15 | Estado no cliente, Context vs `localStorage`, hydration, `aria-live`, formatação com `Intl` |
| T16 | Nunca confiar no cliente: recálculo de preço no servidor, transação atômica, snapshot em `OrderItem` (denormalização intencional), tela de confirmação |
| T17 | Zod: schema compartilhado server/client, `parse` vs `safeParse`, erros por campo |
| T18 | Acessibilidade WCAG 2.1 AA (labels, foco visível, teclado, contraste), teste em 320px |
| T19 | Qualidade: lint/build limpos, teste manual roteirizado, leitura crítica de diff |
| T20 | Env vars por ambiente, deploy Vercel + Neon, migrations em produção, README como portfólio |

## Fluxo de trabalho

1. Escolha a próxima tarefa `[ ]` do `TASKS.md` e marque `[~]`.
2. Siga o loop pedagógico acima (lição → plano → implementação → revisão → fixação).
3. Rode `npm run lint` e `npm run build` — 0 erros é critério de aceite.
4. Marque `[x]`, registre em `docs/aprendizado.md`; mudanças de escopo atualizam `SPEC.md` e `TASKS.md`.

## Comandos

- `npm run dev` — dev com Turbopack
- `npm run lint` / `npm run build` — obrigatório sem erros
- `npx prisma migrate dev` (dev) / `npx prisma migrate deploy` (Vercel)
- `npx prisma db seed` / `npx prisma studio`

## Stack e armadilhas

- Next.js 15.5 App Router + Turbopack, React 19, TypeScript strict, Tailwind v4, shadcn/ui.
- Prisma 6: client gerado em `src/generated/prisma` — importe de `@/generated/prisma` (nunca `@prisma/client`).
- Neon: `DATABASE_URL` (pooled, runtime) e `DIRECT_URL` (direta, migrations). Configure `directUrl = env("DIRECT_URL")` no `datasource` do schema.
- Auth.js v5 beta (`next-auth@beta`) + `@auth/prisma-adapter`: API `auth()`/`handlers`; registre a versão exata no `package.json` ao instalar.
- Next 15: `params`, `searchParams` e `cookies()` são assíncronos.
- Seed: `prisma/seed.ts` + `"prisma": { "seed": "tsx prisma/seed.ts" }` no `package.json` (instalar `tsx`).
- Imagens externas via `next/image` com `remotePatterns` em `next.config.ts`.

## Convenções

- Dinheiro sempre em centavos inteiros (`priceCents`, `totalCents`); total recalculado no servidor a partir dos preços persistidos.
- Toda mutação é Server Action com validação Zod; erros retornam mensagens claras ao formulário (RF-11).
- Estrutura: `src/app/(public)/`, `src/app/login/`, `src/app/admin/<área>/` com `actions.ts`; `src/lib/prisma.ts` (singleton), `src/lib/auth.ts`, `src/lib/validators.ts`.
- RSC por padrão; `"use client"` apenas no carrinho e interações do admin.
- `OrderItem` guarda snapshot de `productName` e `unitPriceCents`; produto `available: false` bloqueia compra.
- Acessibilidade WCAG 2.1 AA essencial (labels, teclado, foco visível, `aria`); mobile-first a partir de 320px.

## Segurança

- Nunca versionar `.env` nem segredos; `.env.example` sem valores reais.
- Toda Server Action de admin valida a sessão antes de gravar (`auth()`).
- `/admin/*` redireciona para `/login` preservando o destino original.
- Senhas com hash bcrypt (recomendado `bcryptjs`, puro JS para Vercel) — nunca texto puro.
- Critério de aceite final: login → CRUD → pedido → status, com `lint` e `build` limpos.
