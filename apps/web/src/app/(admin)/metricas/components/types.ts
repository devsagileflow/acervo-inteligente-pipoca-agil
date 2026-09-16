import { AnalyticsEvent } from "@/packages/schemas";
import { z } from "zod";

export type MetricasDetailsProps = {
  events: AnalyticsEvent[];
};

export const EMPTY_VALUE = "__EMPTY__";

export const granularitySchema = z.enum(["day", "week", "month"]);
export type Granularity = z.infer<typeof granularitySchema>;
