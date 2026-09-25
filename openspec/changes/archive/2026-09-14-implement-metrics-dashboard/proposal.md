# implement-metrics-dashboard

## Why

The Pipoca Ágil platform needs actionable analytics to understand user engagement patterns and optimize content delivery. Currently, the system captures analytics events but lacks visual dashboards to surface key metrics. Administrators need quick, intuitive visibility into:

- **User engagement**: How many unique users are accessing content pages
- **Feature adoption**: Which CTAs (call-to-action buttons) are being clicked most frequently
- **Traffic patterns**: Where users are spending time in the platform

Without this visibility, product and content decisions remain data-blind, reducing the platform's ability to personalize and optimize learning paths.

## What Changes

### Frontend Changes

- Enhance the existing `MetricasPage` and `MetricasDetails` component with interactive visualizations
- Add chart components to render metrics data (page access trends, button click distribution)
- Extend filter capabilities to support time-range analysis
- Display aggregated metrics alongside raw event data

## Capabilities

### New Capabilities

1. **Page Access Metrics**
   - View count of unique users accessing each page
   - Filter by date range
   - Display trends over time using bar/line charts

2. **Button Click Metrics**
   - Analyze click frequency per button (identified by `properties.buttonId`) across pages
   - Cross-tabulate clicks by button and pathname
   - Visualize top-clicked buttons
   - Support drill-down filtering

3. **Dashboard Visualization**
   - Interactive charts (using existing shadcn chart.tsx)
   - Real-time filter updates without page reload
   - Export-ready data summaries

### Modified Capabilities

- **Analytics Event Ingestion**: No changes to event capture; existing `POST /api/analytics/events` remains unchanged
- **MetricasDetails Component**: Extended with new metrics visualizations and enhanced filtering

## Impact

- **User-facing**: Administrators gain real-time visibility into engagement metrics
- **Data-driven decisions**: Product team can identify high-value content and underperforming features
- **Scope**: Limited to analytics display; no changes to authentication, content management, or user-facing features
