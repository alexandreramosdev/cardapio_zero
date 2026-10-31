# Aprendizado — Cardápio Zero

Registro de estudo do projeto: uma entrada por tarefa do `TASKS.md`, preenchida ao concluir cada T## (passo 5 do loop de mentoria). Serve para revisão espaçada e como material de portfólio.

## Template

### T## — título da tarefa

- **Conceitos:** o que foi aprendido (com definição curta)
- **Decisões e porquês:** o que foi decidido e por que (tradeoffs)
- **Dúvidas e erros:** o que travou, mensagem de erro e como resolvemos
- **Exercício:** proposta e eventual resposta

## Entradas

### S00 — Setup de mentoria no opencode

- **Conceitos:** config do opencode em camadas (global vs projeto); skill = instruções carregadas por contexto; subagente = executor especializado com permissões próprias; MCP = processo externo que expõe ferramentas (Prisma, Playwright).
- **Decisões e porquês:** agente `reviewer` é read-only (`edit: deny`) para revisar sem alterar código; MCPs ficam no `opencode.json` do projeto, não no global, para não vazarem para outros projetos.
- **Dúvidas e erros:** config do opencode não é hot-reloaded — precisa reiniciar após alterar.
- **Exercício:** rodar `npx prisma mcp` manualmente e observar o servidor MCP subir.

### T04 — Models Prisma + migrate

- **Conceitos:** model/tabela, PK e FK; cardinalidade (1:1 `User`↔`Restaurant` via `ownerId @unique`, 1:N `Restaurant`→`Category`, N:N conceitual via `Account`); integridade referencial com `onDelete` (`Cascade` apaga filhos, `Restrict` bloqueia, `SetNull` zera a referência); enum (`OrderStatus`); índices — PostgreSQL não indexa FK automaticamente; migration como versionamento do schema (shadow DB + SQL gerado); pooling vs conexão direta (`directUrl` para migrations); `@default(uuid())` é gerado pelo Prisma Client, não pelo banco.
- **Decisões e porquês:** IDs `uuid()`; `Category→Product` com `Restrict` — RF-04 garantido no banco, erro `P2003` tratado na Server Action em T09; `Product→OrderItem.productId?` com `SetNull` — histórico sobrevive à exclusão do produto graças ao snapshot (`productName`/`unitPriceCents`); índice composto `Order[restaurantId, createdAt]` cobre filtro + ordenação da listagem do admin; `directUrl` no datasource para o `migrate` funcionar com pooling do Neon.
- **Dúvidas e erros:** `prisma migrate status` falhou com `P1012: Environment variable not found: DATABASE_URL` porque só existia `.env.example` — resolvido criando banco novo no Neon (região São Paulo) e preenchendo o `.env`. Aprendizado: `prisma format` valida o schema sem banco; `migrate` exige conexão. Verificação usada: query em `information_schema.tables` via client com `node --env-file=.env`.
- **Exercício:** criar uma nova migration `add_category_sort_index` adicionando `@@index([restaurantId, sortOrder])` em `Category`; ler o SQL gerado e confirmar com `npx prisma migrate status`. Opcional: explorar as tabelas com `npx prisma studio`.
- **Pendência registrada:** Auth.js v5 com credentials não suporta estratégia `database` (sessão em banco) — revisar RF-02 no início da T06 (recomendação: JWT).
