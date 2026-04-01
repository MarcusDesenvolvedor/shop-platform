# SaaS E-commerce Platform

Multi-tenant e-commerce application: each merchant gets a **public storefront** (reachable by URL slug) and a **private dashboard** to manage catalog, orders, and store settings. Authentication is handled by **Clerk**; data is stored in **PostgreSQL** via **Prisma**.

**Other language:** [README em português (PT-BR)](./README.pt-BR.md)

---

### What this project is

This repository is a **full-stack SaaS-style e-commerce platform**. It lets a business owner **sign up**, **create a store** (with a unique public URL), and **sell products** online. Shoppers can browse the storefront, add items to a cart, check out, and complete a **simulated payment flow** (PIX-style confirmation in the data model—useful for demos and local development, not a production payment processor).

**Problem it addresses:** small teams and developers need a **clear, modern baseline** for “one app, many stores” e-commerce—catalog, cart, orders, and admin UI—without building auth, database modeling, and API structure from zero.

### Main features (current)

- **Landing & auth:** Public home; **sign-in** and **sign-up** via Clerk; authenticated users are redirected to the dashboard.
- **Multi-tenant stores:** Each user can own a **store** with name, **slug** (public path), and optional cover image.
- **Dashboard:** Overview with **revenue**, **order counts**, **product count**, recent orders, and product highlights; navigation to products, categories, orders, and settings.
- **Catalog management:** Create, list, and edit **products** (name, description, price, stock, brand, category, images, active flag).
- **Categories:** Manage **categories** per store and assign products to them.
- **Orders:** List orders, view order detail; orders include customer address and line items.
- **Store settings:** Update store profile (e.g. name, slug, cover) tied to the signed-in account.
- **Public storefront:** Store home and **product detail** pages under `/store/[slug]`; **shopping cart** (server-backed via API), **checkout**, and **simulated payment confirmation** for placed orders.
- **API layer:** REST-style routes under `/api` for stores, products, categories, cart, checkout, orders, auth sync, and payment confirmation.

### Tech stack

| Area | Technology |
|------|------------|
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| UI | [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Base UI](https://base-ui.com/) / [shadcn](https://ui.shadcn.com/)-style components |
| Auth | [Clerk](https://clerk.com/) (`@clerk/nextjs`) |
| Database | [PostgreSQL](https://www.postgresql.org/) |
| ORM | [Prisma](https://www.prisma.io/) |
| Validation | [Zod](https://zod.dev/) |
| Forms | [React Hook Form](https://react-hook-form.com/) |
| Notifications | [Sonner](https://sonner.emilkowal.ski/) |
| Icons | [Lucide React](https://lucide.dev/) |

### Prerequisites

- **Node.js** (a current LTS version, e.g. 20.x or 22.x, compatible with Next.js 16)
- **npm** (comes with Node; this project uses `package-lock.json`)
- **PostgreSQL** database (local or hosted)
- A **Clerk** application (publishable + secret keys) for authentication

### Environment variables

Copy `.env.example` to `.env` and fill in:

- `DATABASE_URL` — PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` — from the Clerk dashboard
- Clerk route URLs (`NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL`, and post-auth redirects as in `.env.example`)

### Installation and local run

1. **Clone** the repository and open the project folder.

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment:** copy `.env.example` to `.env` and set `DATABASE_URL` and Clerk keys.

4. **Prepare the database:**

   ```bash
   npm run db:generate
   npm run db:push
   ```

   (Use `db:migrate` instead of `db:push` if you rely on migration files in your workflow.)

5. **Optional seed data** (if your repo includes the seed script):

   ```bash
   npm run db:seed:store
   ```

6. **Start the dev server:**

   ```bash
   npm run dev
   ```

7. Open **http://localhost:3000** in the browser.

### Useful scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production server (after `build`) |
| `npm run lint` | ESLint on `src/` |
| `npm run format` | Prettier write |
| `npm run db:studio` | Prisma Studio (DB GUI) |

### Usage examples

- **Merchant flow:** Sign up → land on **Dashboard** → configure **Settings** → add **Categories** and **Products** → share the public URL `/store/<your-slug>`.
- **Shopper flow:** Open `/store/<slug>` → browse products → open a product → **Add to cart** → proceed to **checkout** → complete the demo payment step as implemented in the app.
- **Inspecting data:** Run `npm run db:studio` to browse tables (stores, products, orders, etc.).

### Roadmap / future ideas

- Real **payment gateway** integration (Stripe, PayPal, native PIX provider, etc.)
- **Multi-currency** and localized pricing
- **Email** notifications (order confirmation, shipping)
- **Inventory** alerts and bulk import/export
- **Admin roles** (staff accounts per store)
- **SEO** and **analytics** hooks for storefront pages
- **Image upload** to object storage (S3-compatible) instead of URL-only images
- **Subscriptions** or digital products, if the product model evolves

### Project structure (overview)

```text
Saas/
├── prisma/                 # Schema, migrations, seeds
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router (routes, layouts, API)
│   │   ├── (public)/       # Landing, store storefront, sign-in/up
│   │   ├── (dashboard)/    # Merchant dashboard (protected)
│   │   └── api/            # REST handlers
│   ├── components/         # UI (dashboard, store, shared)
│   ├── features/           # Domain logic (product, order, store, etc.)
│   └── lib/                # Auth helpers, storefront clients, utilities
├── package.json
├── README.md
└── README.pt-BR.md
```
