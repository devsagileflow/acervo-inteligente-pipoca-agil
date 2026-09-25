# Tasks

## 1. Environment and configuration

- [x] 1.1 Add `ADMIN_ACCESS_TOKEN` to `apps/web/.env.example` and verify the variable is documented
- [x] 1.2 Add `ADMIN_ACCESS_TOKEN` to local `.env` and deployment secrets, then verify the application can read it server-side

## 2. Middleware and route protection

- [x] 2.1 Create or update `apps/web/src/proxy.ts` (Next.js 16 proxy convention) to match protected admin routes (starting with `/metricas`) and verify it compiles
- [x] 2.2 Implement token validation in middleware: compare the `hash` query parameter against `ADMIN_ACCESS_TOKEN` and verify the comparison is constant-time
- [x] 2.3 Redirect requests with missing or invalid `hash` to a public page (e.g., `/`) and verify via manual request that a 307/302 redirect occurs
- [x] 2.4 Allow requests with a valid `hash` to proceed and verify the admin page renders

## 3. Admin page integration

- [x] 3.1 Update internal links within `/metricas` (or related admin UI) to preserve the `hash` query parameter and verify navigation keeps the token
- [x] 3.2 Ensure the admin page does not expose `ADMIN_ACCESS_TOKEN` in client-side code and verify by searching the client bundle for the token value

## 4. Testing and documentation

- [x] 4.1 Add unit tests for the token validation helper covering valid, invalid, and missing token cases, and verify all tests pass
- [x] 4.2 Document how to generate, configure, and rotate the admin token in `apps/web/README.md` (or a dedicated `docs/admin-auth.md`) and verify the documented steps work locally
- [x] 4.3 Run `openspec validate --changes "add-admin-url-token-auth"` and confirm the change passes validation
