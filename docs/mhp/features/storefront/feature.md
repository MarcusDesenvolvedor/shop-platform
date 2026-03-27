# Storefront Feature

## Purpose

Define and implement the public storefront experience, allowing visitors to browse active products by store slug, add products to a session cart, and open product detail pages.

## Main Flows

1. Visitor accesses a store using `/store/{slug}`.
2. Route resolves store context by slug.
3. System lists only active store products.
4. Visitor adds products to cart from the storefront.
5. Visitor updates quantities or removes products in the cart panel.
6. Visitor opens product details at `/store/{slug}/product/{id}`.
7. Product detail only renders active products from the same store.

## Business Rules

- Storefront access is public (no authentication required).
- Store context must always be resolved by `slug`.
- Only active products are visible in public pages.
- Product detail must not expose inactive products.
- Cart is local state for the current session.
- Cart items track only `productId` and `quantity`.
- Add to cart must be disabled when stock is `0`.
- Cart quantity must stay between `1` and product stock.
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
  - Add to cart action.
- Storefront header displays:
  - Store name.
  - Cart button with total item count.
- Cart panel displays:
  - Cart items.
  - Quantity update controls.
  - Remove action.
- Product detail displays:
  - Product image, title, brand (optional), description, price, and stock.
- Missing store or product renders 404.

## Dependencies

- Store feature (slug resolution).
- Category feature (category navigation).
- Product feature (active product listing and detail).
- Cart feature (session cart behavior and constraints).
- Next.js App Router for public routing.

## References

- `docs/mhp/business-logic.md` (Section 4 - Product Rules, Section 5 - Category Rules, Section 12 - Routing Rules)
- `docs/mhp/data-model.md`
- `docs/rules/architecture.md`
- `docs/rules/coding-rules.md`
- `docs/rules/workflow-feature.md`
- `docs/rules/workflow-frontend-component.md`
