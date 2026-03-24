# 🗂️ Data Model

**E-commerce Platform (SaaS)**

This document defines the **domain data model**, including:

- Entities
- Attributes
- Relationships
- Aggregates
- Invariants

This model is **technology-agnostic**, but designed to map cleanly to PostgreSQL + Prisma.

---

## 🎯 1. Purpose

The data model aims to:

- Represent all business entities
- Define boundaries between stores (multi-tenancy)
- Guide Prisma schema creation
- Support API and feature design

---

## 🧩 2. Core Aggregates

The system is organized around:

- **User Aggregate** → identity (external via Clerk)
- **Store Aggregate** → multi-tenancy root
- **Product Aggregate**
- **Category Aggregate**
- **Order Aggregate**
- **Cart Aggregate (session-based)**

---

## 👤 3. User Aggregate

### Root: User

Represents an authenticated user (synced with Clerk).

**Attributes:**

- id (UUID or Clerk ID)
- email
- createdAt

**Relationships:**

- User _has one_ Store (optional)
- User _has many_ Orders

**Rules:**

- A user may exist without a store
- Authentication is external (Clerk)

---

## 🏪 4. Store Aggregate (MULTI-TENANCY ROOT)

### Root: Store

Represents a store created by a user.

**Attributes:**

- id (UUID)
- userId
- name
- slug (unique)
- createdAt
- updatedAt

**Relationships:**

- Store _belongs to_ User
- Store _has many_ Products
- Store _has many_ Categories
- Store _has many_ Orders

**Rules:**

- Slug must be unique
- Slug is derived from name:
  - lowercase
  - spaces → `_`
- All domain data must be scoped by Store
- A user can have at most one store (v1 simplification)

---

## 🛍️ 5. Product Aggregate

### Root: Product

Represents a product being sold in a store.

**Attributes:**

- id (UUID)
- storeId
- name
- description
- price
- stock
- brand? (optional)
- isActive
- createdAt
- updatedAt

**Relationships:**

- Product _belongs to_ Store
- Product _belongs to_ Category
- Product _has many_ Images
- Product _has many_ OrderItems

**Rules:**

- Price must be > 0
- Stock must be ≥ 0
- Only active products are visible

---

## 🗂️ 6. Category Aggregate

### Root: Category

Represents a grouping of products.

**Attributes:**

- id (UUID)
- storeId
- name
- createdAt

**Relationships:**

- Category _belongs to_ Store
- Category _has many_ Products

**Rules:**

- Category name is not global, only unique per store

---

## 🖼️ 7. ProductImage

Represents images associated with a product.

**Attributes:**

- id (UUID)
- productId
- url
- createdAt

**Relationships:**

- Belongs to Product

---

## 🛒 8. Cart Aggregate

### Root: Cart

Session-based cart (not persisted long-term in DB or optionally persisted).

**Attributes:**

- id (UUID or sessionId)
- storeId

**Relationships:**

- Cart _has many_ CartItems

---

### CartItem

**Attributes:**

- id
- cartId
- productId
- quantity

**Rules:**

- Quantity ≥ 1
- Must not exceed stock

---

## 📦 9. Order Aggregate

### Root: Order

Represents a finalized purchase.

**Attributes:**

- id (UUID)
- storeId
- userId? (nullable for guest)
- status (PENDING_PAYMENT | PAID | CANCELED)

### Customer Info:

- firstName
- lastName
- street
- number
- city
- state
- country
- identificationNumber
- phone

### Metadata:

- totalAmount
- createdAt

**Relationships:**

- Order _belongs to_ Store
- Order _belongs to_ User (optional)
- Order _has many_ OrderItems

---

### OrderItem

Represents a product inside an order.

**Attributes:**

- id (UUID)
- orderId
- productId
- quantity
- priceAtPurchase

**Relationships:**

- Belongs to Order
- References Product

**Rules:**

- Price must be snapshot (not dynamic)
- Quantity must be ≥ 1

---

## 💳 10. Payment (Simulated)

### Payment

Represents PIX payment simulation.

**Attributes:**

- id (UUID)
- orderId
- status (PENDING | CONFIRMED)
- createdAt
- confirmedAt?

**Relationships:**

- Belongs to Order

---

## 🧭 11. Key Relationships Overview

- User → Store → one-to-one
- Store → Products → many
- Store → Categories → many
- Store → Orders → many
- Product → OrderItems → many
- Order → OrderItems → many
- Order → Payment → one

---

## 🧾 12. Invariants (CRITICAL)

These must ALWAYS hold:

- No Product without Store
- No Category without Store
- No Order without Store
- No OrderItem without Order
- No cross-store relationships allowed
- Cart must contain products from only one store
- Stock must never be negative

---

## 🚫 13. Forbidden Structures

The system must never allow:

- Product referencing another store
- Order mixing multiple stores
- Orphaned OrderItems
- Orders without products

---

## ✅ 14. Final Note

> This model defines **what exists** and **how entities relate**.
> It must remain consistent with Business Logic.

---

**Status:** Active  
**Type:** Domain Data Model  
**Version:** 1.0