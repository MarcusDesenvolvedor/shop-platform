# Payment Feature

## Purpose

Define and implement simulated PIX payment confirmation for orders, ensuring payment state transition, order status transition, and stock reduction happen atomically.

## Main Flows

1. Client requests payment confirmation for an existing order by order id.
2. API validates route params with Zod and calls payment service.
3. Service validates order state and payment state, and enforces payment business rules.
4. Repository executes an atomic transaction to:
   - reduce product stock for all order items,
   - set `Payment` to `CONFIRMED` with `confirmedAt`,
   - set `Order` to `PAID`.
5. API returns the updated confirmation payload.

## Business Rules

- Payment confirmation is simulated and executed by a backend endpoint.
- Only orders in `PENDING_PAYMENT` can be confirmed.
- Only payments in `PENDING` can be confirmed.
- Canceled orders cannot be confirmed.
- Stock must be reduced only when payment is confirmed.
- Stock must never become negative.
- Confirmation operation must be atomic.
- Confirmation must be idempotent for already confirmed orders.

## Entities Involved

- `Order`
- `OrderItem`
- `Payment`
- `Product`

## API Endpoints

- `POST /api/orders/[id]/confirm-payment`
  - Simulated payment confirmation endpoint.
  - Validates route param `id` as UUID.
  - Returns updated order and payment confirmation state.

## UI Behavior

- UI integration is intentionally out of scope for now (task 8.4 ignored).
- The endpoint is available for current simulation and future UI integration.

## Dependencies

- Prisma transaction support for atomic updates.
- Zod for route param validation.
- Order aggregate data from checkout flow.

## References

- `docs/mhp/business-logic.md` (Section 8 - Payment Rules, Section 9 - Stock Rules, Section 13 - Forbidden Behaviors)
- `docs/mhp/data-model.md` (Section 9 - Order Aggregate, Section 10 - Payment, Section 12 - Invariants)
- `docs/rules/architecture.md`
- `docs/rules/coding-rules.md`
- `docs/rules/workflow-feature.md`
- `docs/rules/workflow-api-endpoint.md`
