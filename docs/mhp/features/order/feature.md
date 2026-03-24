# Order Feature

## Purpose

Define and implement checkout and order creation for a single store, including customer data validation, stock validation, total calculation, and initial payment lifecycle.

## Main Flows

1. Visitor or authenticated user sends checkout request to a store slug endpoint.
2. API validates route params and request body with Zod.
3. Service resolves the store context and validates cart items against active store products.
4. Service calculates total amount and creates order with item price snapshots.
5. Repository persists `Order`, `OrderItem`, and `Payment` with initial pending statuses.

## Business Rules

- Order checkout is store-scoped using `slug`.
- Order must contain at least one item.
- Every order item quantity must be greater than or equal to `1`.
- Cart items must belong to the requested store and be active.
- Requested quantity must not exceed available product stock at checkout time.
- Order status at creation must be `PENDING_PAYMENT`.
- Payment must be created with status `PENDING` when order is created.
- Total amount must be computed from item snapshots (`price * quantity`) at checkout time.
- Stock is validated on checkout, but reduced only after payment confirmation.

## Entities Involved

- `Store`
- `Product`
- `Order`
- `OrderItem`
- `Payment`
- `User` (optional relation for authenticated checkouts)

## API Endpoints

- `POST /api/stores/[slug]/checkout`
  - Public endpoint.
  - Accepts cart items and customer checkout data.
  - Creates an order with `PENDING_PAYMENT` and related payment with `PENDING`.
- `GET /api/stores/[slug]/orders`
  - Owner endpoint.
  - Lists all orders for the authenticated owner's store.
- `GET /api/stores/[slug]/orders/[orderId]`
  - Owner endpoint.
  - Returns full order detail including customer info, items, and payment status.

## UI Behavior

- Dashboard order list at `/dashboard/orders` with status filtering and badges.
- Dashboard order detail at `/dashboard/orders/[id]` with customer info, items table, and payment confirmation action.
- Checkout and confirmation UI on the storefront are planned for a later phase.

## Dependencies

- Prisma for order, order items, payment, and product reads.
- Zod for request validation.
- Store feature for slug-to-store resolution.
- Clerk auth context (optional) to link checkout to authenticated users.

## References

- `docs/mhp/business-logic.md` (Section 7 - Order Rules, Section 8 - Payment Rules, Section 9 - Stock Rules, Section 13 - Forbidden Behaviors)
- `docs/mhp/data-model.md` (Section 9 - Order Aggregate, Section 10 - Payment, Section 12 - Invariants)
- `docs/rules/architecture.md`
- `docs/rules/coding-rules.md`
- `docs/rules/workflow-feature.md`
- `docs/rules/workflow-api-endpoint.md`
