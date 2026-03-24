# Architecture

This is a **multi-tenant e-commerce platform (SaaS)** that allows users to create stores and sell products to end customers.

---

## 🛠️ Tech Stack

### Frontend

* **Framework**: Next.js (App Router)
* **Language**: TypeScript
* **UI Library**: shadcn/ui
* **Styling**: Tailwind CSS
* **Form management**: React Hook Form
* **Validation**: Zod

---

### Backend

* **Runtime**: Node.js (via Next.js)
* **Database**: PostgreSQL
* **ORM**: Prisma
* **Authentication**: Clerk
* **API**: Next.js Route Handlers (`/api`)

---

### Infrastructure (Optional / Future)

* **Hosting**: Vercel
* **Database**: PostgreSQL (Neon or local)
* **File Storage**: (future) S3
* **Monitoring**: (future) Sentry

---

## 📁 Project Structure

The project follows a **feature-oriented and layered structure**.

```bash
/src
  /app
    /(public)
      page.tsx
      /store/[slug]
        page.tsx

    /(dashboard)
      /dashboard
      /products
      /categories
      /orders

  /components
    /ui
    /shared
    /forms
    /store

  /lib
    prisma.ts
    auth.ts
    utils.ts

  /server
    /services
    /repositories

  /api

  /types
  /schemas

/docs
  /mhp
    /features
      /authentication
        feature.md
      /store
        feature.md
      /product
        feature.md
      /order
        feature.md
```

---

### Structure Rules

* UI components must NOT contain business logic
* Services must NOT access Prisma directly
* Repositories are the ONLY layer allowed to use Prisma
* API routes must be thin (validation + service calls)
* Each feature must be isolated

---

## 🧠 Feature Documentation Strategy

Each feature MUST have its own documentation file.

### Structure

```bash
/docs/mhp/features/{feature-name}/feature.md
```

### Rules

* Must be created BEFORE or DURING development
* Must include:

  * Purpose
  * Flows
  * Business rules
  * Dependencies
* Must always be updated

### Purpose

* Provide context to AI
* Avoid logic loss
* Serve as feature-level source of truth

---

## 🎯 System Design Principles

* The system starts simple and evolves
* Multi-tenancy is the foundation
* All data must be scoped by store
* Simplicity over complexity
* AI-friendly architecture:

  * predictable structure
  * low abstraction
  * strong documentation

---

## 🗄️ Database

### Schema Structure

* Source: `schema.prisma`
* Reference:

  * `data-model.md`
  * `business-logic.md`

---

## 🔄 Data Flow Architecture

### Client-Server Communication

* API via Next.js route handlers
* Forms submit to `/api/*`

---

### Database Access Pattern

* Prisma used ONLY in repositories
* Services handle business logic

---

## 🔐 Security Architecture

### Authentication & Authorization

* Clerk handles authentication
* Only authenticated users manage stores
* Store ownership must be validated

---

### Data Security

* Validation: Zod
* SQL injection: prevented by Prisma
* Secrets via environment variables

---

## 🏪 Multi-tenancy

* Store is the isolation boundary
* Every entity must include:

  * `storeId` or `slug`

The system must guarantee:

* No cross-store access
* Full data isolation

---

## ⚡ Performance Considerations

### Frontend

* Use Next.js optimizations
* Keep components small

---

### Backend

* Index by `storeId` and `slug`
* Keep queries simple

---

## 🔧 Development Workflow

### Code Quality

* ESLint + Prettier
* TypeScript strict mode

---

## 🚫 Architectural Constraints

The system must NEVER:

* Access DB outside repositories
* Put business logic in UI
* Mix store data
* Skip validation
* Trust frontend data

---

## ✅ Final Principle

> This architecture must guide all implementation decisions.
> If code contradicts this document, the code is wrong.

---

**Status:** Active
**Type:** Architecture Definition
**Version:** 1.0
