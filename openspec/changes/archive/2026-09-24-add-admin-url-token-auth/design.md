# Design

## Context

The web application (`apps/web`) is a Next.js project that currently exposes `/metricas` as an admin-only route but has no mechanism to restrict access. The proposal in `proposal.md` describes a lightweight server-side token approach. This document details the implementation approach.

## Goals / Non-Goals

**Goals:**

- Protect designated admin routes using a server-side environment variable token.
- Validate the token via Next.js middleware so protection applies consistently across routes.
- Preserve the token in the URL query string (`?hash=...`) for simplicity.
- Avoid leaking the token to the client bundle.

**Non-Goals:**

- Full user authentication or session management.
- Login page, password flows, or account management.
- Role-based access control beyond a single admin token.
- API-layer protection (this is a web-app concern only).

## Decisions

### 1. Use Next.js Middleware for route protection

- **Rationale**: Middleware runs on the edge/server before a route is rendered, making it a single point of enforcement for all admin routes. It can inspect the incoming request URL and redirect or block early.
- **Alternatives considered**: Adding checks inside each admin page (`page.tsx`). Rejected because it scatters protection logic and is easy to forget when adding new admin routes.

### 2. Store the token in an environment variable

- **Rationale**: Keeps the secret out of source control and allows different values per environment (local, staging, production).
- **Variable name**: `ADMIN_ACCESS_TOKEN`.
- **Rotation**: Update the environment variable and redeploy; no database migration required.

### 3. Pass token as a query parameter

- **Rationale**: Matches the user's request and avoids cookies/sessions. It is simple to generate, share, and revoke.
- **Trade-off**: URLs with tokens can be logged in proxies or browser history. Mitigated by the fact that this is an internal admin tool with a single shared secret and by using HTTPS in production.

### 4. Preserve token across internal navigation

- **Rationale**: Once an admin accesses `/metricas?hash=...`, internal links within the admin area should continue to include the hash so the user is not kicked out.
- **Approach**: Links inside admin pages read the current `hash` query param and append it. Middleware also rewrites/redirects to include the hash when needed.

## Risks / Trade-offs

- **Token in URL** → token may appear in server logs, browser history, or analytics. **Mitigation**: use HTTPS, keep admin URLs internal, and rotate the token periodically.
- **Single shared secret** → if leaked, anyone with the URL can access admin routes. **Mitigation**: store the token securely, rotate on suspected leak, and consider moving to a proper auth system if the admin surface grows.
- **Middleware runs on every request** → negligible for low-traffic admin pages, but protected route matching should be explicit to avoid impacting public routes.

## Migration Plan

1. Generate a random UUID/hash for `ADMIN_ACCESS_TOKEN`.
2. Add `ADMIN_ACCESS_TOKEN` to local `.env` and deployment secrets.
3. Implement middleware and protected-route configuration.
4. Update `/metricas` links (if any) to include the token placeholder or ensure users access it via the shared URL.
5. Validate locally and deploy.
