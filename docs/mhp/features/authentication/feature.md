# Authentication Feature

## Purpose

Provide secure authentication and authorization using Clerk, and guarantee that each authenticated Clerk user has a synchronized local `User` record in the application database.

## Main Flows

1. Visitor opens a protected dashboard route.
2. Middleware enforces authentication for dashboard routes.
3. Authenticated request reaches the dashboard layout.
4. The system synchronizes the Clerk user with the local `User` table:
   - If user exists by `clerkId`, update basic data.
   - If user does not exist, create it on first access.
5. User can access protected dashboard pages.

## Business Rules

- Only authenticated users can access dashboard routes.
- Local `User` data must be created on first authenticated access.
- Store owners can only manage their own store data (enforced by feature services in later phases).
- Authentication must not contain business logic unrelated to auth.

## Entities Involved

- `User` (local database entity)
- Clerk user session / identity

## API Endpoints

- `POST /api/auth/sync`
  - Purpose: synchronize current Clerk user with local database.
  - Auth required: yes.

## UI Behavior

- Public routes are accessible without authentication.
- Protected dashboard routes redirect unauthenticated users to sign-in.
- Sign-in and sign-up pages are rendered with Clerk components.

## Dependencies

- Clerk (`@clerk/nextjs`) for authentication/session.
- Prisma for local user persistence.
- Zod for request validation.

## References

- `docs/mhp/business-logic.md` (Section 11 — Access Control Rules)
- `docs/mhp/data-model.md`
- `docs/rules/architecture.md`
- `docs/rules/coding-rules.md`
