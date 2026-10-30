# 🍔 Cardápio Zero - SaaS de Cardápio Digital

_Um SaaS completo para hamburguerias e restaurantes gerenciarem seus cardápios e receberem pedidos online de forma simples e eficiente._

**Status:** em desenvolvimento — a v1 está especificada em [`SPEC.md`](./SPEC.md) e o progresso é acompanhado em [`TASKS.md`](./TASKS.md).

---

## 📸 Preview do Projeto

_(Pendente: gravar um GIF ou captura de tela do cardápio público funcionando e adicionar aqui)_

---

## 🚀 Sobre o Projeto

O **Cardápio Zero** foi desenvolvido como um projeto de portfólio para demonstrar habilidades em desenvolvimento full-stack com as tecnologias mais modernas do ecossistema JavaScript/TypeScript. A aplicação permite que donos de restaurantes se cadastrem, criem e personalizem seus cardápios, e recebam pedidos diretamente dos clientes através de uma página web exclusiva para o seu estabelecimento.

Este projeto resolve o problema de pequenos estabelecimentos que precisam de uma presença online para pedidos sem depender das altas taxas de aplicativos de delivery.

---

## ✨ Funcionalidades Principais

- **Painel Administrativo:** Gerenciamento completo (CRUD) de produtos e categorias do cardápio.
- **Cardápio Público:** Página web customizável para cada restaurante exibir seus produtos.
- **Carrinho de Compras:** Interface intuitiva para clientes selecionarem seus itens.
- **Recebimento de Pedidos:** Fluxo de checkout simplificado com pedido registrado no banco e acompanhamento de status no painel.
- **Autenticação:** acesso do administrador protegido com Auth.js (e-mail e senha).
- _(Futuro) Integração com gateways de pagamento._

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando as seguintes tecnologias:

- **Frontend:** React, Next.js, TypeScript, Tailwind CSS
- **UI:** Shadcn/ui (Componentes Radix UI)
- **Backend:** Next.js (API Routes / Server Actions)
- **Autenticação:** Auth.js (credentials + adapter Prisma)
- **Banco de Dados:** PostgreSQL
- **ORM:** Prisma
- **Ambiente de Dev:** WSL2 (Ubuntu), Node.js
- **Deploy:** Vercel (Frontend) e Neon (Banco de Dados)

---

## ⚙️ Como Rodar o Projeto Localmente

Siga os passos abaixo para executar o projeto em seu ambiente de desenvolvimento.

**1. Clone o repositório:**

```bash
git clone https://github.com/alexandreramosdev/cardapio_zero.git
cd cardapio_zero
```

**2. Instale as dependências:**

```bash
npm install
```

**3. Configure as Variáveis de Ambiente:**

- Copie o exemplo: `cp .env.example .env`
- Preencha no `.env`:
  - `DATABASE_URL` — conexão com pooling do PostgreSQL (Neon).
  - `DIRECT_URL` — conexão direta, usada pelas migrations do Prisma.
  - `AUTH_SECRET` — segredo do Auth.js (gere com `npx auth secret`).
- O `.env` não é versionado; nunca comite credenciais.

**4. Aplique as migrations e popule o banco:**

```bash
npx prisma migrate dev
npx prisma db seed
```

**5. Rode a aplicação em modo de desenvolvimento:**

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado!

---

## 📚 Documentação

- [`SPEC.md`](./SPEC.md) — especificação da v1 (escopo, requisitos, modelo de dados).
- [`TASKS.md`](./TASKS.md) — progresso das tarefas de implementação.
