# Product Feature

## Purpose

Define and implement the product catalog feature for a store, including image URLs, activation status, and stock/price rules.

## Main Flows

1. Owner accesses a store context by slug.
2. API validates route params and request payload with Zod.
3. Service enforces product business rules and multi-tenant isolation.
4. Repository performs Prisma operations scoped by `storeId`.
5. Public consumers list only active products by store slug.

## Business Rules

- A product belongs to exactly one store.
- Product management is owner-scoped and store-scoped.
- Required fields: `name`, `description`, `price`, `stock`, `categoryId`.
- `price` must be greater than `0`.
- `stock` must be greater than or equal to `0`.
- `isActive` controls public visibility and purchasability.
- Images are optional and stored as URL entries (`ProductImage`).
- A product category must belong to the same store as the product.

## Entities Involved

- `Store`
- `Product`
- `ProductImage`
- `Category`

## API Endpoints

- `GET /api/stores/[slug]/products`
  - Public endpoint.
  - Returns only active products from the store.
- `POST /api/stores/[slug]/products`
  - Owner endpoint.
  - Creates a product in the owner store.
- `GET /api/stores/[slug]/products/[productId]`
  - Owner endpoint.
  - Returns one store product.
- `PATCH /api/stores/[slug]/products/[productId]`
  - Owner endpoint.
  - Updates product data and optional images.
- `DELETE /api/stores/[slug]/products/[productId]`
  - Owner endpoint.
  - Deletes one product from the owner store.

## UI Behavior

- Product dashboard UI CRUD is intentionally out of scope for now (task 4.7 ignored).
- API contracts are delivered so the UI can be integrated later.

## Dependencies

- Clerk (`@clerk/nextjs`) for authenticated owner actions.
- Prisma for persistence.
- Zod for input validation.
- Store feature for ownership and store context.

## References

- `docs/mhp/business-logic.md` (Section 4 - Product Rules, Section 11 - Access Control Rules)
- `docs/mhp/data-model.md` (Section 5 - Product Aggregate, Section 7 - ProductImage)
- `docs/rules/architecture.md`
- `docs/rules/coding-rules.md`
- `docs/rules/workflow-feature.md`
- `docs/rules/workflow-api-endpoint.md`
