# Category Feature

## Purpose

Define and implement the category feature for organizing products within a store. Categories are store-scoped and used for filtering and organization.

## Main Flows

1. Authenticated owner accesses a store by slug.
2. API validates route params and request payload with Zod.
3. Service validates store ownership using store context.
4. Repository executes Prisma operations scoped by `storeId`.
5. Owner can create, list, get, update, and delete categories for that store.

## Business Rules

- A category belongs to exactly one store.
- Category data is private and owner-scoped.
- Category name must be unique per store (not globally).
- Categories are used for product filtering and organization.
- A category cannot be deleted while products still reference it.
- A store must keep at least one category; deleting the only category is not allowed.

## Entities Involved

- `Store`
- `Category`
- `Product` (for safe deletion rule)

## API Endpoints

- `GET /api/stores/[slug]/categories`
  - Lists categories from the owner store.
- `POST /api/stores/[slug]/categories`
  - Creates a category in the owner store.
- `GET /api/stores/[slug]/categories/[categoryId]`
  - Returns one category from the owner store.
- `PATCH /api/stores/[slug]/categories/[categoryId]`
  - Updates category name.
- `DELETE /api/stores/[slug]/categories/[categoryId]`
  - Deletes category if it has no products.

## UI Behavior

- UI for categories is intentionally skipped in this phase (task 3.6 ignored).
- This phase delivers backend contracts required by Product and dashboard UI later.

## Dependencies

- Clerk (`@clerk/nextjs`) for authentication.
- Prisma for persistence.
- Zod for request validation.
- Store feature for ownership and multi-tenant isolation.

## References

- `docs/mhp/business-logic.md` (Section 5 - Category Rules, Section 11 - Access Control Rules)
- `docs/mhp/data-model.md` (Section 6 - Category Aggregate)
- `docs/rules/architecture.md`
- `docs/rules/coding-rules.md`
- `docs/rules/workflow-feature.md`
- `docs/rules/workflow-api-endpoint.md`
