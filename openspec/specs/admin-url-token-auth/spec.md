# Admin URL Token Authentication

## Purpose

Protect administrative routes in the Next.js web application by validating a server-side admin access token passed as a URL query parameter.

## Requirements

### Requirement: Admin token is required for protected routes

The system SHALL deny access to protected admin routes when the request does not include a valid admin access token in the URL query string.

#### Scenario: Missing admin token

- **WHEN** a request is made to a protected admin route without an `hash` query parameter
- **THEN** the system SHALL redirect the request to a public page or return a 403 Forbidden response

#### Scenario: Invalid admin token

- **WHEN** a request is made to a protected admin route with an `hash` query parameter that does not match the configured admin access token
- **THEN** the system SHALL redirect the request to a public page or return a 403 Forbidden response

### Requirement: Valid admin token grants access

The system SHALL allow access to protected admin routes when the request includes an `hash` query parameter that matches the configured admin access token.

#### Scenario: Valid admin token

- **WHEN** a request is made to a protected admin route with an `hash` query parameter that exactly matches the configured admin access token
- **THEN** the system SHALL serve the requested admin page

### Requirement: Admin token is configured server-side

The system SHALL read the admin access token from a server-side environment variable and SHALL NOT expose it to the client bundle.

#### Scenario: Token is server-only

- **WHEN** the application builds or runs
- **THEN** the admin access token SHALL only be available in server-side code and SHALL NOT be emitted to the browser

### Requirement: Protected routes are explicitly defined

The system SHALL maintain a list of protected admin routes and SHALL apply token validation only to those routes.

#### Scenario: Non-admin route is unaffected

- **WHEN** a request is made to a non-admin route
- **THEN** the system SHALL serve the page without requiring an admin access token
