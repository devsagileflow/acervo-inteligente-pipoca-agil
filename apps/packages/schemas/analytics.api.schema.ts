import z from "zod";

export const analyticsEventTypeSchema = z.enum(["page_view", "click"]);
export type AnalyticsEventType = z.infer<typeof analyticsEventTypeSchema>;

export const analyticsEventBodySchema = z.object({
  eventName: analyticsEventTypeSchema,
  pagePath: z.string().min(1),
  targetId: z.string().min(1).optional(),
  anonymousId: z.string().min(1).optional(),
  referrer: z.url().optional(),
  properties: z.record(z.string(), z.unknown()).optional(),
  occurredAt: z.coerce.date().optional(),
});
export type AnalyticsEventBody = z.infer<typeof analyticsEventBodySchema>;

export const analyticsEventSchema = z.object({
  id: z.string(),
  eventName: analyticsEventTypeSchema,
  pagePath: z.string(),
  targetId: z.string().nullish(),
  anonymousId: z.string().nullish(),
  referrer: z.url().nullish(),
  properties: z.record(z.string(), z.unknown()).nullish(),
  occurredAt: z.coerce.date().nullish(),
  userId: z.string().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;
