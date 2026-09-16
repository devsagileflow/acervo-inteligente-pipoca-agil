"use client";

import { useMemo, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { parseISO, startOfDay, endOfDay } from "date-fns";
import { EMPTY_VALUE, granularitySchema, type MetricasDetailsProps } from "./types";

const eventMetricsSchema = z.object({
  minDate: z.string().optional(),
  maxDate: z.string().optional(),
  eventName: z.string().optional(),
  pagePath: z.string().optional(),
  targetId: z.string().optional(),
  userId: z.string().optional(),
  granularity: granularitySchema.optional().default("day"),
});

type EventMetricsFilter = z.infer<typeof eventMetricsSchema>;

const isEmpty = (value: unknown): value is null | undefined | "" =>
  value === null || value === undefined || value === "";

const buildSelectOptions = (items: (string | null | undefined)[]) => {
  const hasEmpty = items.some(isEmpty);
  const uniqueValues = Array.from(
    new Set(items.filter((item): item is string => !isEmpty(item))),
  ).sort((a, b) => a.localeCompare(b));

  return {
    hasEmpty,
    values: uniqueValues,
  };
};

const matchSelectFilter = (value: string | null | undefined, filterValue?: string) => {
  if (!filterValue) return true;
  if (filterValue === EMPTY_VALUE) return isEmpty(value);
  return value === filterValue;
};

export type UseFilterFormResult = ReturnType<typeof useFilterForm>;

export const useFilterForm = ({ events }: MetricasDetailsProps) => {
  const form = useForm<EventMetricsFilter>({
    resolver: zodResolver(eventMetricsSchema) as Resolver<EventMetricsFilter>,
    defaultValues: {
      minDate: undefined,
      maxDate: undefined,
      eventName: undefined,
      pagePath: undefined,
      targetId: undefined,
      userId: undefined,
      granularity: "day",
    },
  });

  const [isPending, startTransition] = useTransition();
  const filters = useWatch({ control: form.control });

  const eventNameOptions = useMemo(
    () => buildSelectOptions(events.map((event) => event.eventName)),
    [events],
  );
  const pagePathOptions = useMemo(
    () => buildSelectOptions(events.map((event) => event.pagePath)),
    [events],
  );
  const targetIdOptions = useMemo(
    () => buildSelectOptions(events.map((event) => event.targetId)),
    [events],
  );
  const userIdOptions = useMemo(
    () => buildSelectOptions(events.map((event) => event.userId)),
    [events],
  );

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (!matchSelectFilter(event.eventName, filters.eventName)) return false;
      if (!matchSelectFilter(event.pagePath, filters.pagePath)) return false;
      if (!matchSelectFilter(event.targetId, filters.targetId)) return false;
      if (!matchSelectFilter(event.userId, filters.userId)) return false;

      const occurredAt = event.occurredAt;

      if (filters.minDate && occurredAt) {
        const min = startOfDay(parseISO(filters.minDate));
        if (occurredAt < min) return false;
      }

      if (filters.maxDate && occurredAt) {
        const max = endOfDay(parseISO(filters.maxDate));
        if (occurredAt > max) return false;
      }

      return true;
    });
  }, [events, filters]);

  const [minDateCalendar, setMinDateCalendar] = useState<Date | undefined>();
  const [maxDateCalendar, setMaxDateCalendar] = useState<Date | undefined>();

  const handleClearFilters = () => {
    form.reset();
    setMinDateCalendar(undefined);
    setMaxDateCalendar(undefined);
  };

  return {
    form,
    isPending,
    startTransition,
    filters,
    eventNameOptions,
    pagePathOptions,
    targetIdOptions,
    userIdOptions,
    filteredEvents,
    minDateCalendar,
    setMinDateCalendar,
    maxDateCalendar,
    setMaxDateCalendar,
    handleClearFilters,
  };
};
