## 1. Data model and contracts

- [x] 1.1 Create shared analytics Zod schemas for event ingestion and event types.
- [x] 1.2 Add Prisma model(s) and indexes for storing analytics events.
- [ ] 1.3 Run the Prisma migration for the new analytics schema.

## 2. API ingestion

- [x] 2.1 Create analytics service functions to persist events and query basic aggregates.
- [x] 2.2 Create the analytics route with POST /api/analytics/events.
- [x] 2.3 Register the analytics route in the API feature registry.

## 3. Frontend instrumentation

- [x] 3.1 Add a client-side page view tracker that emits page_view on route change.
- [x] 3.2 Add click tracking for the main CTAs used in the marketing pages.
- [x] 3.3 Generate and persist anonymousId in the browser for anonymous event correlation.

## 4. Validation and observability

- [ ] 4.1 Add tests or validation checks for event payload rejection and successful ingestion.
- [x] 4.2 Add basic query coverage for total views, unique views, and CTA clicks.
- [ ] 4.3 Verify rate limiting and logging behavior for the analytics endpoint.
