## 1. Frontend: Dashboard Components

### 1.1 Extend MetricasDetails component

- [x] Update `MetricasDetails` filter form schema to include granularity option (day/week/month)
- [ ] Display loading and error states during data fetch

### 1.2 Create Page Access visualization

- [x] Implement `PageAccessChart` component using shadcn chart.tsx
  - Display bar chart: X-axis = pagePath, Y-axis = uniqueUsers
  - Alternative: line chart if showing time-series by granularity
  - Show tooltip with event count on hover
- [x] Render metrics summary (total unique users, total events)

### 1.3 Create Button Click visualization

- [x] Implement `ButtonClickChart` component using shadcn chart.tsx
  - Display horizontal bar chart: top 10 clicked buttons by clickCount
  - Include properties.buttonId and pathname labels
  - Show tooltip with additional metadata
- [ ] Add optional drill-down by pathname

### 1.4 Update MetricasPage layout

- [x] Reorganize MetricasPage to show:
  1. Filters (date range, pathname, granularity)
  2. Page Access chart and summary
  3. Button Click chart and summary
  4. Raw events table (keep existing)
- [x] Ensure responsive design for admin dashboards (desktop-first)

### 1.5 Add loading and error handling

- [x] Show skeleton loaders while fetching metrics
- [x] Disable filters while data is loading
