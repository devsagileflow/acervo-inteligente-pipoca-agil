# Proposal

## Why

The `/web` application currently has no login mechanism or way to distinguish administrators from end users. However, it already exposes admin-only routes such as `/metricas`. Without authentication, anyone can access these routes, which is a security risk. We need a lightweight way to protect admin routes without building a full user authentication system.

## What Changes

- Introduce a server-side generated admin access token (UUID/hash) stored as an environment variable.
- Validate the token on every request to protected admin routes via a Next.js middleware or route guard.
- Require the token to be passed as a query parameter (e.g., `/metricas?hash=123e4567...`).
- Redirect or deny access when the token is missing or invalid.
- Add documentation on how to generate and rotate the admin token.

## Capabilities

### New Capabilities

- `admin-url-token-auth`: Server-side admin access token validation for protected Next.js routes using a URL query parameter.

### Modified Capabilities

- None.

## Impact

- Affects the `apps/web` Next.js application (middleware, route handlers, and admin pages such as `/metricas`).
- Adds a new environment variable requirement for deployments (e.g., `ADMIN_ACCESS_TOKEN`).
- No changes to the API layer or database.
