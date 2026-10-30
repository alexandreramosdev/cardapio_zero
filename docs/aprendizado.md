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

- **Conceitos:** (a preencher)
- **Decisões e porquês:** (a preencher)
- **Dúvidas e erros:** (a preencher)
- **Exercício:** (a preencher)
