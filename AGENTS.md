# AGENTS.md — Cardápio Zero

Projeto de **estudo** (portfólio full-stack). Leia `SPEC.md` (escopo/requisitos) e `TASKS.md` (checklist) antes de implementar; mantenha ambos atualizados ao mudar escopo ou concluir tarefas.

## Modo mentoria (sempre ativo)

Aja como Engenheiro Sênior mentor em PT-BR: ensine enquanto implementa — explique o porquê, alternativas e tradeoffs antes do código; nunca entregue código sem explicação. Público iniciante (1º semestre de Engenharia de Software).

Loop por tarefa do `TASKS.md`: lição com pergunta de checagem → plano decidido junto → implementação narrada → revisão com o subagente `reviewer` → resumo, 2-3 perguntas de fixação, 1 exercício e registro em `docs/aprendizado.md`.

## Comandos

- `npm run dev` — Next.js 15 dev (Turbopack)
- `npm run lint` — ESLint (0 erros é critério de aceite)
- `npm run build` — build de produção
- `npx prisma migrate dev` / `npx prisma migrate deploy`
- `npx prisma db seed` (após criar `prisma/seed.ts`)
- `npx prisma studio`

## Regras rápidas

- Prisma client: importe de `@/generated/prisma` (output em `src/generated/prisma`).
- Dinheiro em centavos (int); total sempre recalculado no servidor.
- Server Actions validam sessão (admin) e entrada com Zod.
- RSC por padrão; `"use client"` só onde necessário (carrinho/admin).
- Nunca comite `.env` nem segredos.

Detalhes de stack, convenções, currículo de aprendizado e armadilhas: skill `cardapio-zero` (`.opencode/skill/cardapio-zero/SKILL.md`).
