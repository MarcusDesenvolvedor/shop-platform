# Storefront Feature

## Purpose

Define and implement the public storefront experience, allowing visitors to browse active products by store slug and open product detail pages.

## Main Flows

1. Visitor accesses a store using `/store/{slug}`.
2. Route resolves store context by slug.
3. System lists only active store products.
4. Visitor optionally filters products by category.
5. Visitor opens product details at `/store/{slug}/product/{id}`.
6. Product detail only renders active products from the same store.

## Business Rules

- Storefront access is public (no authentication required).
- Store context must always be resolved by `slug`.
- Only active products are visible in public pages.
- Product detail must not expose inactive products.
- Categories are used for browsing/filtering only.
- Data must remain fully isolated by store.

## Entities Involved

- `Store`
- `Category`
- `Product`
- `ProductImage`

## Routes

- `GET /store/[slug]`
  - Public storefront listing.
  - Shows active products for the store.
- `GET /store/[slug]/product/[id]`
  - Public product detail.
  - Shows one active product from the store.

## UI Behavior

- Store pages use a public layout with:
  - Store header.
  - Category navigation.
- Product listing displays:
  - Primary image (if available).
  - Name, short description, price, and stock.
- Product detail displays:
  - Product image, title, brand (optional), description, price, and stock.
- Missing store or product renders 404.

## Dependencies

- Store feature (slug resolution).
- Category feature (category navigation).
- Product feature (active product listing and detail).
- Next.js App Router for public routing.

## References

- `docs/mhp/business-logic.md` (Section 4 - Product Rules, Section 5 - Category Rules, Section 12 - Routing Rules)
- `docs/mhp/data-model.md`
- `docs/rules/architecture.md`
- `docs/rules/coding-rules.md`
- `docs/rules/workflow-feature.md`
- `docs/rules/workflow-frontend-component.md`
