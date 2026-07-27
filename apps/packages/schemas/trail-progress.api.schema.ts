import { z } from "zod";

import { contentTypeSchema } from "./content.schema";

export const trailProgressSchema = z.object({
  id: z.string(),
  userId: z.string(),
  trailId: z.string(),
  completionPercentage: z.number().int().min(0).max(100),
  isCompleted: z.boolean(),
  completedAt: z.coerce.date().nullish(),
  lastViewedAt: z.coerce.date().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type TrailProgress = z.infer<typeof trailProgressSchema>;

export const trailItemProgressSchema = z.object({
  id: z.string(),
  userId: z.string(),
  trailId: z.string(),
  trailItemId: z.string().nullish(),
  contentType: contentTypeSchema,
  contentId: z.string(),
  viewedAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type TrailItemProgress = z.infer<typeof trailItemProgressSchema>;

export const markTrailItemViewedBodySchema = z.object({
  trailItemId: z.string(),
});
export type MarkTrailItemViewedBody = z.infer<
  typeof markTrailItemViewedBodySchema
>;

export const trailProgressParamsSchema = z.object({
  trailId: z.string(),
});
export type TrailProgressParams = z.infer<typeof trailProgressParamsSchema>;

export const trailProgressDetailsSchema = z.object({
  progress: trailProgressSchema,
  viewedItemIds: z.array(z.string()),
});
export type TrailProgressDetails = z.infer<typeof trailProgressDetailsSchema>;
