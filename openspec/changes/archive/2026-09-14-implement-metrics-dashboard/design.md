## Context

**Platform State:**

- Analytics events are captured via `POST /api/analytics/events` (types: click, scroll_depth, video_play, video_complete)
- Events stored in PostgreSQL `AnalyticsEvent` table with indexed dimensions: eventName, pagePath, targetId, userId
- Metrics page exists at `apps/web/src/app/(admin)/metricas/page.tsx` with a `MetricasDetails` filter component
- Chart UI components available at `apps/web/src/components/ui/chart.tsx`
- API follows schema-first pattern: contracts defined in `apps/packages/schemas`
- Backend uses Fastify + Zod + Prisma with centralized error handling

**Constraints:**

- Only **click** events are relevant for metrics (other event types are informational)

## Goals / Non-Goals

**Goals:**

1. Surface page access metrics (unique users per page)
2. Surface button click metrics (click count per properties.buttonId/pathname combination)
3. Provide date-range filtering and time-series visualization
4. Maintain schema-first API contract definitions
5. Reuse existing chart components and UI kit (shadcn)

**Non-Goals:**

- Real-time streaming analytics (cached/batch updates acceptable)
- Machine learning or predictive analytics
- User segmentation or cohort analysis (out of scope for v1)
- Export to external BI tools (no API needed yet)
- Mobile-optimized dashboard (desktop-first)

## Decisions

### 1. Frontend Architecture

- **Decision**: Keep all logic in `MetricasDetails` component; no separate metrics state management
- **Rationale**: Simple, low-traffic admin dashboard; existing `useForm + useWatch` pattern handles filters adequately
- **Trade-off**: Refactor later if complexity grows (e.g., dashboard export, scheduled reports)
