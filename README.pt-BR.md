# Plataforma de E-commerce SaaS

Aplicação de e-commerce **multi-tenant**: cada lojista tem uma **vitrine pública** (acessível por slug na URL) e um **painel privado** para gerenciar catálogo, pedidos e configurações da loja. A autenticação é feita com **Clerk**; os dados ficam em **PostgreSQL** via **Prisma**.

**Outro idioma:** [English README](./README.md)

---

### O que é este projeto

Este repositório é uma **plataforma de e-commerce em estilo SaaS full-stack**. Permite que um lojista **crie conta**, **configure uma loja** (com URL pública por **slug**) e **venda produtos** na internet. O visitante navega na vitrine, usa o **carrinho**, finaliza o **pedido** e passa por um **fluxo de pagamento simulado** (confirmação no estilo PIX no modelo de dados—útil para demos e desenvolvimento local; **não** substitui um gateway de pagamento em produção).

**Problema que resolve:** equipes e desenvolvedores precisam de uma **base moderna e clara** para e-commerce **multi-loja**—catálogo, carrinho, pedidos e painel administrativo—sem implementar autenticação, modelagem de banco e APIs do zero.

### Principais funcionalidades (atuais)

- **Landing e autenticação:** Página inicial pública; **login** e **cadastro** via Clerk; usuários autenticados vão para o dashboard.
- **Lojas multi-tenant:** Cada usuário pode ter uma **loja** com nome, **slug** (caminho público) e imagem de capa opcional.
- **Dashboard:** Visão geral com **receita**, **quantidade de pedidos**, **total de produtos**, pedidos recentes e destaques de produtos; acesso a produtos, categorias, pedidos e configurações.
- **Gestão de catálogo:** Criar, listar e editar **produtos** (nome, descrição, preço, estoque, marca, categoria, imagens, ativo/inativo).
- **Categorias:** Gerenciar **categorias** por loja e vincular produtos.
- **Pedidos:** Listar pedidos, ver detalhe; pedidos incluem endereço do cliente e itens.
- **Configurações da loja:** Atualizar dados da loja (nome, slug, capa) vinculados à conta logada.
- **Vitrine pública:** Home da loja e **página de produto** em `/store/[slug]`; **carrinho** (persistido via API), **checkout** e **confirmação de pagamento simulada** para pedidos.
- **API:** Rotas REST em `/api` para lojas, produtos, categorias, carrinho, checkout, pedidos, sincronização de auth e confirmação de pagamento.

### Tecnologias

| Área | Tecnologia |
|------|------------|
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| Linguagem | [TypeScript](https://www.typescriptlang.org/) |
| UI | [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), componentes no estilo [Base UI](https://base-ui.com/) / [shadcn](https://ui.shadcn.com/) |
| Autenticação | [Clerk](https://clerk.com/) (`@clerk/nextjs`) |
| Banco de dados | [PostgreSQL](https://www.postgresql.org/) |
| ORM | [Prisma](https://www.prisma.io/) |
| Validação | [Zod](https://zod.dev/) |
| Formulários | [React Hook Form](https://react-hook-form.com/) |
| Notificações | [Sonner](https://sonner.emilkowal.ski/) |
| Ícones | [Lucide React](https://lucide.dev/) |

### Pré-requisitos

- **Node.js** (versão LTS atual, ex.: 20.x ou 22.x, compatível com Next.js 16)
- **npm** (incluso no Node; o projeto usa `package-lock.json`)
- Banco **PostgreSQL** (local ou hospedado)
- Aplicação no **Clerk** (chaves publishable e secret) para autenticação

### Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

- `DATABASE_URL` — string de conexão com o PostgreSQL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` — painel do Clerk
- URLs de rotas do Clerk (`NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL` e redirecionamentos pós-login conforme `.env.example`)

### Instalação e execução local

1. **Clone** o repositório e abra a pasta do projeto.

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure o ambiente:** copie `.env.example` para `.env` e defina `DATABASE_URL` e as chaves do Clerk.

4. **Prepare o banco:**

   ```bash
   npm run db:generate
   npm run db:push
   ```

   (Use `db:migrate` em vez de `db:push` se o fluxo do seu time for baseado em arquivos de migração.)

5. **Seed opcional** (se o repositório incluir o script):

   ```bash
   npm run db:seed:store
   ```

6. **Suba o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

7. Acesse **http://localhost:3000** no navegador.

### Scripts úteis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção (após `build`) |
| `npm run lint` | ESLint em `src/` |
| `npm run format` | Formatar com Prettier |
| `npm run db:studio` | Prisma Studio (interface do banco) |

### Exemplos de uso

- **Fluxo lojista:** Cadastro → **Dashboard** → **Configurações** → **Categorias** e **Produtos** → compartilhar a URL pública `/store/<seu-slug>`.
- **Fluxo cliente:** Abrir `/store/<slug>` → ver produtos → abrir produto → **Adicionar ao carrinho** → **checkout** → concluir o passo de pagamento demo implementado na aplicação.
- **Inspecionar dados:** `npm run db:studio` para navegar pelas tabelas (lojas, produtos, pedidos, etc.).

### Roadmap / ideias futuras

- Integração com **gateway de pagamento** real (Stripe, PayPal, provedor PIX, etc.)
- **Multi-moeda** e preços localizados
- **E-mails** transacionais (confirmação de pedido, envio)
- Alertas de **estoque** e importação/exportação em massa
- **Papéis administrativos** (contas de equipe por loja)
- **SEO** e integração com **analytics** nas páginas da vitrine
- **Upload de imagens** para armazenamento objeto (compatível com S3) em vez de apenas URLs
- **Assinaturas** ou produtos digitais, conforme evolução do modelo

### Estrutura básica do projeto

```text
Saas/
├── prisma/                 # Schema, migrações, seeds
├── public/                 # Arquivos estáticos
├── src/
│   ├── app/                # Next.js App Router (rotas, layouts, API)
│   │   ├── (public)/       # Landing, vitrine, login/cadastro
│   │   ├── (dashboard)/    # Painel do lojista (protegido)
│   │   └── api/            # Handlers REST
│   ├── components/         # UI (dashboard, loja, compartilhados)
│   ├── features/           # Regras de domínio (produto, pedido, loja, etc.)
│   └── lib/                # Auth, clientes da vitrine, utilitários
├── package.json
├── README.md
└── README.pt-BR.md
```
