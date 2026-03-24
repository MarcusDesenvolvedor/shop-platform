# Cart Feature

## Purpose

Define and implement a session-based cart that works without authentication, enforces single-store isolation, and validates stock on every cart mutation.

## Main Flows

1. Visitor opens a public store by slug.
2. API validates route params and request body with Zod.
3. Service resolves the store context and enforces cart business rules.
4. Repository reads product data scoped by `storeId` for stock validation and cart hydration.
5. Cart state is persisted in cookies (no cart table in database).

## Business Rules

- Cart is session-based and does not require login.
- Cart must contain products from one store only.
- Cart operations:
  - Add product
  - Update quantity
  - Remove product
- Quantity must be greater than or equal to `1`.
- Quantity must never exceed current product stock.
- Only active products can be added to the cart.
- Cart data is scoped by `storeId` and resolved from store `slug`.

## Entities Involved

- `Store`
- `Product`
- `Cart` (session aggregate in cookies)
- `CartItem` (session aggregate in cookies)

## API Endpoints

- `GET /api/stores/[slug]/cart`
  - Public endpoint.
  - Returns current cart for the provided store context.
- `POST /api/stores/[slug]/cart`
  - Public endpoint.
  - Adds product to cart (`addToCart`).
- `PATCH /api/stores/[slug]/cart`
  - Public endpoint.
  - Updates item quantity (`updateQuantity`).
- `DELETE /api/stores/[slug]/cart`
  - Public endpoint.
  - Removes one item (`removeFromCart`).

## UI Behavior

- Cart UI implementation is intentionally out of scope for now (task 6.4 ignored).
- API and service contracts are delivered to support UI integration later.

## Dependencies

- Prisma for product lookup and stock validation.
- Zod for input validation.
- Store feature for store slug resolution.
- Next.js cookies API for session persistence.

## References

- `docs/mhp/business-logic.md` (Section 6 - Cart Rules, Section 13 - Forbidden Behaviors)
- `docs/mhp/data-model.md` (Section 8 - Cart Aggregate, Section 12 - Invariants)
- `docs/rules/architecture.md`
- `docs/rules/coding-rules.md`
- `docs/rules/workflow-feature.md`
- `docs/rules/workflow-api-endpoint.md`
