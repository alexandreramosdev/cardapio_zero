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

### T05 — Seed: admin com senha hasheada + restaurante demo

- **Conceitos:** hash ≠ criptografia (mão única — dá para ir da senha ao hash, nunca o contrário); salt (aleatório por usuário, embutido no próprio hash salvo — mata rainbow table e o atalho "mesmo hash ⇒ mesma senha"); fator de custo (bcrypt é lento por design; custo 10 ≈ ~100ms); `bcryptjs` (puro JS, sem build nativo — ideal para Vercel) vs `bcrypt` nativo; formato do hash `$2b$10$…` (versão do algoritmo + custo + salt + digest); o `compare` extrai salt/custo do hash salvo e recalcula — nunca "descriptografa"; idempotência com `upsert` (rodar N vezes = mesmo estado final); seed = estado inicial reprodutível; segredos por env com validação *fail-fast*; chave natural vs id determinístico no `upsert`; `P2002` (violação de unicidade); índice composto cobre o prefixo e torna índices simples redundantes.
- **Decisões e porquês:** custo 10 (equilíbrio entre segurança e ciclo de dev); `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` obrigatórias no `.env` (erro claro se ausentes, mínimo 8 caracteres); dados do restaurante fixos no código e rotulados como fictícios (SPEC); upsert do restaurante por `ownerId` — a invariante 1:1 — e não por `slug`, que é mutável (evita `P2002` ao re-rodar o seed depois de renomear); `update: {}` no restaurante para não desfazer edições futuras em `/admin/settings` (P03); `update: { passwordHash }` no usuário faz o seed resetar a senha para a do `.env`; `process.exitCode = 1` em vez de `process.exit(1)` para o `$disconnect` do `finally` rodar; import via alias `@/generated/prisma`.
- **Dúvidas e erros:** aviso de depreciação do `package.json#prisma` (Prisma 7 pedirá `prisma.config.ts`) — aceito e anotado na v1; `require("bcryptjs/package.json")` falha com `ERR_PACKAGE_PATH_NOT_EXPORTED` — pacotes modernos restringem subcaminhos com o campo `exports`; `bcryptjs` v3 já traz tipos TypeScript (dispensa `@types/bcryptjs`); verificação de idempotência feita rodando o seed 3x → sempre 1 usuário e 1 restaurante.
- **Exercício (concluído):** seed ganhou categoria "Hambúrgueres" + produto "X-Burger Demo" (2500 centavos). Resolvido com chaves naturais: `@@unique([restaurantId, name])` em `Category` e `@@unique([categoryId, name])` em `Product` (migrations próprias), com `where` composto (`restaurantId_name` / `categoryId_name`). Lições do caminho: (1) **a chave é contrato** — o `create` precisa gravar a mesma chave que o `where` procura; a 1ª tentativa (`where: { id: "xx" }` sem gravar id no create) duplicaria a cada execução; (2) id determinístico funciona, mas exige o mesmo valor nos dois lados (`const productId`) — chave natural elimina essa possibilidade de erro; (3) índice único composto `(categoryId, name)` tornou `@@index([categoryId])` redundante → removido na migration `remove_redundant_product_category_id_index`; (4) `(categoryId, name)` permite o mesmo prato em categorias diferentes (decisão de negócio, diferente de restringir por restaurante); (5) constraints provadas no banco: tentativa de duplicata retorna `P2002` — as Server Actions (T09/T10) vão capturar isso e converter em mensagens do RF-11.
- **Ideia registrada para a v2:** modificadores de produto ("bem passado / mal passado" etc.) como `ProductOptionGroup` + `ProductOption` (com `priceDeltaCents`), total recalculado no servidor — discutir no SPEC v2.
