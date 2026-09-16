"use client";

import { AnalyticsEvent } from "@/packages/schemas";
import { PageAccessChart } from "./page-access-chart";
import { ButtonClickChart } from "./button-click-chart";
import { ChartSkeleton } from "@/components/ui/skeleton";

import { useFilterForm } from "./useFilterForm";
import { FilterForm } from "./filterForm";
import { Granularity, MetricasDetailsProps } from "./types";

// Compute page access metrics (unique users per page)
const computePageAccessMetrics = (events: AnalyticsEvent[], granularity: Granularity) => {
  const clickEvents = events.filter((e) => e.eventName === "click");

  // Group by pagePath and granularity
  const pageMetrics: Record<string, { users: Set<string>; events: number; date?: Date }> = {};

  clickEvents.forEach((event) => {
    if (!event.pagePath) return;

    if (!pageMetrics[event.pagePath]) {
      pageMetrics[event.pagePath] = { users: new Set(), events: 0 };
    }

    if (event.userId) {
      pageMetrics[event.pagePath].users.add(event.userId);
    }
    pageMetrics[event.pagePath].events += 1;

    if (!pageMetrics[event.pagePath].date && event.occurredAt) {
      pageMetrics[event.pagePath].date = event.occurredAt;
    }
  });

  // Convert to chart data
  const chartData = Object.entries(pageMetrics)
    .map(([pagePath, data]) => ({
      pagePath,
      uniqueUsers: data.users.size,
      eventCount: data.events,
    }))
    .sort((a, b) => b.uniqueUsers - a.uniqueUsers);

  // Compute summary metrics
  const totalUniqueUsers = new Set(clickEvents.filter((e) => e.userId).map((e) => e.userId)).size;
  const totalEvents = clickEvents.length;

  return { chartData, totalUniqueUsers, totalEvents };
};

// Compute button click metrics (top 10 clicked buttons)
const computeButtonClickMetrics = (events: AnalyticsEvent[]) => {
  const clickEvents = events.filter((e) => e.eventName === "click");

  // Group by buttonId and pathname
  const buttonMetrics: Record<string, { clickCount: number; paths: Set<string> }> = {};

  clickEvents.forEach((event) => {
    const buttonId = (event.properties?.buttonId as string) || event.targetId || "unknown";
    const pathname = event.pagePath || "unknown";

    if (!buttonMetrics[buttonId]) {
      buttonMetrics[buttonId] = { clickCount: 0, paths: new Set() };
    }

    buttonMetrics[buttonId].clickCount += 1;
    buttonMetrics[buttonId].paths.add(pathname);
  });

  // Convert to chart data and get top 10
  const chartData = Object.entries(buttonMetrics)
    .map(([buttonId, data]) => ({
      buttonId,
      clickCount: data.clickCount,
      pathCount: data.paths.size,
    }))
    .sort((a, b) => b.clickCount - a.clickCount)
    .slice(0, 10);

  // Compute summary metrics
  const totalClickEvents = clickEvents.length;
  const totalUniqueButtons = Object.keys(buttonMetrics).length;

  return { chartData, totalClickEvents, totalUniqueButtons };
};

export const MetricasDetails = ({ events }: MetricasDetailsProps) => {
  const useFilterFormResult = useFilterForm({ events });
  const {
    form,
    isPending,
    startTransition,
    filters,
    filteredEvents,
    eventNameOptions,
    pagePathOptions,
    targetIdOptions,
    userIdOptions,
    minDateCalendar,
    setMinDateCalendar,
    maxDateCalendar,
    setMaxDateCalendar,
    handleClearFilters,
  } = useFilterFormResult;

  return (
    <div className="space-y-6">
      <FilterForm useFilterFormResult={useFilterFormResult} />

      {/* Page Access Metrics */}
      {isPending ? (
        <ChartSkeleton />
      ) : (
        (() => {
          const pageMetrics = computePageAccessMetrics(
            filteredEvents,
            filters.granularity || "day",
          );
          return pageMetrics.chartData.length > 0 ? (
            <PageAccessChart
              data={pageMetrics.chartData}
              totalUniqueUsers={pageMetrics.totalUniqueUsers}
              totalEvents={pageMetrics.totalEvents}
            />
          ) : null;
        })()
      )}

      {/* Button Click Metrics */}
      {isPending ? (
        <ChartSkeleton />
      ) : (
        (() => {
          const buttonMetrics = computeButtonClickMetrics(filteredEvents);
          return buttonMetrics.chartData.length > 0 ? (
            <ButtonClickChart
              data={buttonMetrics.chartData}
              totalClickEvents={buttonMetrics.totalClickEvents}
              totalUniqueButtons={buttonMetrics.totalUniqueButtons}
            />
          ) : null;
        })()
      )}

      {/* Events Summary */}
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm">
          {filteredEvents.length}{" "}
          {filteredEvents.length === 1 ? "evento encontrado" : "eventos encontrados"}
        </p>
        <pre className="bg-muted max-h-96 overflow-auto rounded-lg border p-4 text-xs">
          {JSON.stringify(filteredEvents, null, 2)}
        </pre>
      </div>
    </div>
  );
};
