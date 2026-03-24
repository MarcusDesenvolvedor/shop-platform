# 🔄 Workflow — API Development

**E-commerce Platform (SaaS)**

This document defines the **step-by-step workflow and rules** for developing API endpoints.

It must be followed whenever creating or modifying any API-related code.

---

## 🎯 1. Purpose

Ensure that every API endpoint:

* Follows the Architecture
* Respects the Business Logic
* Uses the Data Model correctly
* Complies with Coding Rules
* Is consistent, predictable, and maintainable

---

## 🧱 2. Technology Context

This workflow assumes:

* Next.js (Route Handlers)
* TypeScript
* RESTful APIs
* Clerk authentication
* Prisma ORM
* Zod validation

---

## 📌 3. Before Creating an Endpoint

Before writing code, you MUST have:

* The **feature.md** describing the use case
* Access to:

  * `business-logic.md`
  * `data-model.md`
  * `architecture.md`
  * `coding-rules.md`

❗ Never create endpoints based on assumptions.

---

## 🛠️ 4. API Creation Steps

---

### Step 1 — Define the Use Case

Clearly define:

* What the endpoint does
* Who can access it
* Which store it belongs to

---

### Step 2 — Define Route & Method

Use REST conventions:

* `GET` → retrieve
* `POST` → create
* `PATCH` → update
* `DELETE` → cancel/delete

---

### Route Rules

* Use plural resources
* Use clean and predictable paths

Examples:

```bash
POST   /api/products
GET    /api/products
GET    /api/products/:id
PATCH  /api/products/:id
DELETE /api/products/:id
```

---

### Step 3 — Define Schema (Zod)

Create validation schemas:

* Request schema
* Response schema (optional)

Rules:

* Validate ALL inputs
* Do not trust frontend
* Do not expose internal structure

---

### Step 4 — Implement Route Handler

Location:

```bash
/src/app/api/{resource}/route.ts
```

---

### Responsibilities:

* Receive request
* Parse input
* Validate with Zod
* Get authenticated user (if needed)
* Call service
* Return response

---

### Must NOT:

* Contain business logic
* Access Prisma directly

---

## ⚙️ 5. Service Layer

Location:

```bash
/src/features/{feature}/feature.service.ts
```

---

### Responsibilities:

* Implement use case logic
* Enforce business rules
* Validate ownership (storeId)

---

### Must NOT:

* Access database directly

---

## 🗄️ 6. Repository Layer

Location:

```bash
/src/features/{feature}/feature.repository.ts
```

---

### Responsibilities:

* Perform Prisma operations
* Query database

---

### Must NOT:

* Contain business logic

---

## 🔐 7. Authentication & Authorization

* Use Clerk session
* Extract authenticated user
* Validate ownership:

Example:

* User must own the store
* User must have permission to act

---

## 🏪 8. Multi-Tenancy Rules

* Every request must include:

  * `storeId` or `slug`
* All queries must be scoped by store

---

### NEVER:

* Access data without store filter
* Trust client-provided storeId without validation

---

## 📄 9. API Response Standards

Responses must:

* Be consistent
* Use JSON

---

### Standard Format:

```json
{
  "data": {}
}
```

---

### Error Format:

```json
{
  "error": "Error message"
}
```

---

### Rules:

* Never expose stack traces
* Use clear messages

---

## ❌ 10. Forbidden Practices

* Business logic in API routes
* Skipping validation
* Accessing Prisma outside repositories
* Returning raw database entities
* Mixing store data
* Trusting frontend input

---

## 🧪 11. Validation Checklist

Before finishing an endpoint:

* [ ] Schema created and validated
* [ ] Route handler is thin
* [ ] Service implements logic
* [ ] Repository handles DB
* [ ] Auth validated
* [ ] Store ownership validated
* [ ] Errors handled
* [ ] Response consistent
* [ ] Lint passes

---

## 🏁 12. Final Principle

> Every API endpoint is a contract.
> It must be predictable, validated, and aligned with business rules.

---

**Status:** Active
**Type:** API Workflow
**Version:** 1.0
