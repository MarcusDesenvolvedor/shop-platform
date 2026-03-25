# Authentication Feature

## Purpose

Provide secure authentication and authorization using Clerk, and guarantee that each authenticated Clerk user has a synchronized local `User` record in the application database.

## Main Flows

1. Visitor opens the public home route (`/`).
2. If visitor is authenticated, system redirects to `/dashboard`.
3. If visitor is unauthenticated, landing page is displayed with Clerk login/sign-up actions.
4. Visitor opens a protected dashboard route.
5. Middleware enforces authentication for dashboard routes.
6. Authenticated request reaches the dashboard layout.
7. The system synchronizes the Clerk user with the local `User` table:
   - If user exists by `clerkId`, update basic data.
   - If user does not exist, create it on first access.
8. User can access protected dashboard pages.
9. Authenticated user can sign out from the dashboard sidebar and is redirected to `/`.

## Business Rules

- Only authenticated users can access dashboard routes.
- Authenticated users must not remain on the public home route and should be redirected to `/dashboard`.
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

- Public home route (`/`) shows the Hero Landing Page only for unauthenticated users.
- Landing Page authentication actions must use Clerk components.
- Protected dashboard routes redirect unauthenticated users to sign-in.
- Sign-in and sign-up pages are rendered with Clerk components.
- Dashboard sidebar must include logout action that signs out via Clerk and redirects to `/`.

## Dependencies

- Clerk (`@clerk/nextjs`) for authentication/session.
- Prisma for local user persistence.
- Zod for request validation.

## References

- `docs/mhp/business-logic.md` (Section 11 — Access Control Rules)
- `docs/mhp/data-model.md`
- `docs/rules/architecture.md`
- `docs/rules/coding-rules.md`
