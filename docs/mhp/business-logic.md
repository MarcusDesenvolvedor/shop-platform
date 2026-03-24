# 🧠 Business Logic
**E-commerce Platform (SaaS)**

This document defines the **business rules, constraints, and behaviors** of the system.

It is the **single source of truth**. Any implementation that contradicts this document is incorrect.

---

## 🎯 1. System Purpose

The system enables users to:

- Create and manage their own online stores
- Sell products to customers
- Allow customers to browse and purchase products
- Manage orders and sales

The system operates as a **multi-tenant platform**, where each store is isolated.

---

## 👤 2. Actors

### 2.1 User (Authenticated via Clerk)

A user is a single entity that can:

- Create and manage a store (store owner)
- Purchase products from other stores (customer)

A user may act as both simultaneously.

---

### 2.2 Visitor (Unauthenticated)

- Can browse public store pages
- Can add products to cart
- Can complete checkout as guest

---

### 2.3 Store

A store represents a business created by a user.

---

## 🏪 3. Store Rules

- A store:
  - Belongs to exactly **one user (owner)**.
  - Must have a **unique slug**.
  - Slug is derived from store name:
    - Lowercased
    - Spaces replaced with `_`
- Slug must be unique across the system.

- Store data must be **fully isolated**:
  - Products
  - Orders
  - Categories

- A user may have:
  - Zero or one store (for simplicity in this version)

---

## 🛍️ 4. Product Rules

- Every product:
  - Belongs to exactly one store
  - Has:
    - Name
    - Description
    - Price > 0
    - Stock ≥ 0
    - Category
    - Optional brand
    - Images (optional)

- Product states:
  - Active
  - Inactive

- Only active products:
  - Are visible to customers
  - Can be purchased

- Stock rules:
  - Must never be negative
  - Must be validated before checkout

---

## 🗂️ 5. Category Rules

- A category:
  - Belongs to exactly one store
  - Has a name
- Categories are used only for filtering and organization

---

## 🛒 6. Cart Rules

- Cart is session-based (no login required)

- A cart:
  - Belongs to one store only
  - Cannot contain products from multiple stores

- Cart operations:
  - Add product
  - Update quantity
  - Remove product

- Constraints:
  - Quantity must be ≥ 1
  - Cannot exceed available stock

---

## 📦 7. Order Rules

- An order:
  - Belongs to one store
  - Contains one or more products
  - Is created from a cart

- Order must contain:
  - Customer information:
    - First name
    - Last name
    - Street
    - Number
    - City
    - State
    - Country
    - Identification number
    - Phone

- Order status:
  - PENDING_PAYMENT
  - PAID
  - CANCELED

---

## 💳 8. Payment Rules (PIX - Simulated)

- Payment is simulated

- When an order is created:
  - Status = PENDING_PAYMENT

- System must allow:
  - Manual or simulated confirmation

- When payment is confirmed:
  - Status → PAID

---

## 📉 9. Stock Rules

- When order is created:
  - Stock must be validated

- When payment is confirmed:
  - Stock must be reduced

- Stock must never go below zero

---

## 📋 10. Order Management Rules

Store owners must be able to:

- View all orders of their store
- View order details
- See order status

Constraints:

- Orders cannot be deleted
- Orders may only:
  - Change status
- Historical integrity must be preserved

---

## 🔐 11. Access Control Rules

- Only authenticated users can:
  - Create stores
  - Manage products
  - View store dashboard

- Store owners can only:
  - Access their own store data

- Users must never:
  - Access other stores’ private data

---

## 🌐 12. Routing Rules

- Each store is accessed via:
  - `/store/{slug}`

- All store-related data must be resolved using the slug

---

## 🚫 13. Forbidden Behaviors

The system must never:

- Mix data between stores
- Allow stock to become negative
- Allow checkout with invalid data
- Allow access to other store's data
- Allow orders without products
- Allow cart with multiple stores

---

## 🧾 14. Data Consistency Rules

- Every product must belong to a store
- Every order must belong to a store
- Every category must belong to a store
- No orphan data allowed

---

## 🔄 15. System Evolution Rules

Future features must not break:

- Store isolation
- Order integrity
- Stock rules

---

## ✅ 16. Final Principle

> If the code contradicts this document, the code is wrong.

---

**Status:** Active  
**Type:** Business Source of Truth  
**Version:** 1.0