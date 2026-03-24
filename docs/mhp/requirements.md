# 📋 Requirements

**E-commerce Platform (SaaS) – Fullstack Web App**

This document defines **what the system must do** from a business and user perspective.

> ⚠️ This system is a **multi-tenant e-commerce platform**, not a single store.

---

## 🎯 1. Product Vision

Build a **fullstack web application** that allows users to:

- Create and manage their own online store
- Register and manage products
- Sell products to end customers
- Handle orders and sales through a simple dashboard

The platform should act as a **bridge between store owners and their customers**.

---

## 👥 2. Users & Roles

The system has a unified user model.

### Authenticated Users (via Clerk)

Users can:

- Create and manage their own store (become a store owner)
- Purchase products from other stores (act as customers)

### Unauthenticated Visitors

- Browse landing page
- Browse public store products
- Add items to cart
- Checkout as guest (optional)

---

## 🧩 3. Core Use Cases

### Visitors

- View landing page
- Register / Login

### Store Owners

- Create store
- Access dashboard
- Create, update, delete products
- Manage categories and inventory

### End Customers

- Browse store products
- View product details
- Add to cart
- Checkout via PIX
- Receive order confirmation

---

## 🔐 4. Authentication Requirements

- Authentication handled via **Clerk**
- Users must:
  - Sign up / log in
  - Maintain session securely
- System must:
  - Restrict store management to authenticated users

---

## 🏪 5. Store Management Requirements

Store owners must be able to:

- Create a store
- Define store name
- Manage store settings

System must:

- Associate all data to a specific store (multi-tenancy)
- Ensure data isolation between stores

---

## 🛍️ 6. Product Catalog Requirements

Store owners must be able to:

- Create products with:
  - Name
  - Description
  - Price
  - Stock
  - Category
  - Brand (optional)
  - Images
- Update and delete products

End customers must be able to:

- Browse products
- View product details

System must:

- Show only active products
- Ensure stock consistency

---

## 🛒 7. Cart Requirements

End customers must be able to:

- Add products to cart
- Update quantities
- Remove products

System must:

- Support session-based cart (no login required)
- Validate stock before adding

---

## 📦 8. Checkout Requirements

End customers must be able to:

- Proceed to checkout
- Enter basic purchase information
- Confirm purchase via PIX

System must:

- Calculate total price
- Generate order
- Reserve stock
- Mark order as pending payment
- Confirm order after payment (simulated or manual)

---

## 📋 9. Order Management Requirements

Store owners must be able to:

- View orders
- See order details
- Track order status

System must:

- Maintain order history
- Prevent modification of completed orders

---

## 📊 10. Dashboard Requirements

Store owners must be able to:

- View summary metrics (basic)
  - Total sales
  - Number of orders
  - Revenue (optional)

---

## 📱 11. Non-functional Requirements

The system should:

- Be fast and responsive
- Be scalable for multiple stores
- Ensure data isolation per store
- Be easy to use (UX-focused)
- Be secure (auth + data protection)

---

## 🔮 12. Future Enhancements

- Multiple payment methods
- Public store pages (custom URLs)
- Reviews and ratings
- Analytics dashboard
- Notifications

---

## ✅ 13. Final Note

> This document defines **WHAT the system does**.  
> It must be used to derive the **Business Logic**, which becomes the source of truth.

---

**Status:** Initial  
**Type:** Requirements Specification  
**Version:** 1.0
