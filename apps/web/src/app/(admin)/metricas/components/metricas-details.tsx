"use client";

import { ButtonClickChart, ChartSkeleton, PageViewChart, VideoChart } from "./charts";

import { useFilterForm } from "./useFilterForm";
import { FilterForm } from "./filterForm";
import { MetricasDetailsProps } from "./types";

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
      {/* Page View Metrics */}
      <p>Quantidade de visualizações de página</p>
      {isPending ? <ChartSkeleton /> : <PageViewChart events={filteredEvents} />}

      {/* Button Click Metrics */}
      <p>Quantidade de cliques em botões</p>
      {isPending ? <ChartSkeleton /> : <ButtonClickChart events={filteredEvents} />}

      {/* Video Metrics */}
      <p>Quantidade de interações com vídeos</p>
      {isPending ? <ChartSkeleton /> : <VideoChart events={filteredEvents} />}

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
