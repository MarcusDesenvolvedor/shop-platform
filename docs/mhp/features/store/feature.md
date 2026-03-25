# Store Feature

## Purpose

Define and implement the store feature as the multi-tenant root, allowing authenticated users to create and manage exactly one store in v1.

## Main Flows

1. Authenticated user requests store creation.
2. API validates input with Zod and resolves the synchronized local user.
3. Service generates the slug from store name (`lowercase`, `spaces -> _`).
4. Service enforces business constraints:
   - User can have at most one store.
   - Store slug must be globally unique.
5. Store creation initializes base store data:
   - A default category is created automatically (`General`).
6. Repository persists and retrieves store data using Prisma.
7. Owner fetches:
   - Own stores list.
   - Store by slug with ownership validation.

## Business Rules

- A store belongs to exactly one user.
- A user can have zero or one store in v1.
- Slug is generated from name using:
  - lowercase
  - spaces replaced by `_`
- Slug must be unique across the platform.
- A newly created store must include one default category (`General`).
- Private store data access must validate ownership.
- All downstream features must resolve store context by slug and ownership.

## Entities Involved

- `User`
- `Store`

## API Endpoints

- `POST /api/stores`
  - Creates a store for the authenticated user.
- `GET /api/stores`
  - Returns stores owned by the authenticated user.
- `GET /api/stores/[slug]`
  - Returns the owner-scoped store by slug.
- `PATCH /api/stores/[slug]`
  - Updates store name (and auto-regenerates slug) for the owner.

## UI Behavior

- Store creation form is displayed in the dashboard layout when the user has no store.
- Settings page at `/dashboard/settings` allows updating the store name.
- Sidebar displays real store name and user name, with dynamic active route state.

## Dependencies

- Clerk (`@clerk/nextjs`) for authentication.
- Prisma for store persistence.
- Zod for request validation.

## References

- `docs/mhp/business-logic.md` (Section 3 - Store Rules, Section 11 - Access Control Rules)
- `docs/mhp/data-model.md` (Section 4 - Store Aggregate)
- `docs/rules/architecture.md`
- `docs/rules/coding-rules.md`
- `docs/rules/workflow-feature.md`
- `docs/rules/workflow-api-endpoint.md`
