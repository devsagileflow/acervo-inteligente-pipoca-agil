"use client";

import { ButtonClickChart, ChartSkeleton, PageViewChart, VideoChart } from "./charts";
import { FeedbackFormCard } from "./cards";

import { useFilterForm } from "./useFilterForm";
import { FilterForm } from "./filterForm";
import { MetricasDetailsProps } from "./types";
import type { Video, FeedbackForm, FeedbackResponse } from "@/packages/schemas";

type Props = MetricasDetailsProps & {
  videos: Video[];
  feedbackForm: FeedbackForm;
  feedbackResponses: FeedbackResponse[];
};

export const MetricasDetails = ({ events, videos, feedbackForm, feedbackResponses }: Props) => {
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
    <div className="flex flex-col gap-16">
      <FilterForm useFilterFormResult={useFilterFormResult} />
      <div className="flex flex-col gap-4 text-center">
        <p className="text-muted-foreground text-xl font-bold">
          Quantidade de visualizações de página
        </p>
        {isPending ? <ChartSkeleton /> : <PageViewChart events={filteredEvents} />}
      </div>

      <div className="flex flex-col gap-4 text-center">
        <p className="text-muted-foreground text-xl font-bold">Quantidade de cliques em botões</p>
        {isPending ? <ChartSkeleton /> : <ButtonClickChart events={filteredEvents} />}
      </div>

      <div className="flex flex-col gap-4 text-center">
        <p className="text-muted-foreground text-xl font-bold">
          Quantidade de interações com vídeos
          <br />
          <span className="text-sm font-normal">
            Obs: O tempo é calculado com base na duração de um &lsquo;play&rsquo; de vídeo até que
            ele seja pausado ou finalizado. O evento de término de vídeo só será registrado quando o
            vídeo realmente terminar.
          </span>
        </p>
        {isPending ? <ChartSkeleton /> : <VideoChart events={filteredEvents} videos={videos} />}
      </div>

      <FeedbackFormCard feedbackForm={feedbackForm} feedbackResponses={feedbackResponses} />
    </div>
  );
};
