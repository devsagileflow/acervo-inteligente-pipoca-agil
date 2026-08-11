import { z } from "zod";

import { contentTypeSchema, paginationQuerySchema } from "./content.schema";
import { videoSchema } from "./video.api.schema";

export const trailItemSchema = z.object({
  id: z.string(),
  trailId: z.string(),
  contentType: contentTypeSchema,
  contentId: z.string(),
  position: z.number().int().positive(),
  isRequired: z.boolean(),
  isActive: z.boolean(),
  deletedAt: z.coerce.date().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  content: videoSchema.nullish(),
});
export type TrailItem = z.infer<typeof trailItemSchema>;

export const trailSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullish(),
  imageUrl: z.string().nullish(),
  isPublished: z.boolean(),
  isActive: z.boolean(),
  deletedAt: z.coerce.date().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  items: z.array(trailItemSchema).optional(),
});
export type Trail = z.infer<typeof trailSchema>;

export const trailParamsSchema = z.object({
  trailId: z.string(),
});
export type TrailParams = z.infer<typeof trailParamsSchema>;

export const trailItemParamsSchema = z.object({
  trailId: z.string(),
  itemId: z.string(),
});
export type TrailItemParams = z.infer<typeof trailItemParamsSchema>;

export const createTrailBodySchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1).optional(),
  isPublished: z.boolean().optional(),
  isActive: z.boolean().optional(),
});
export type CreateTrailBody = z.infer<typeof createTrailBodySchema>;

export const updateTrailBodySchema = createTrailBodySchema.partial();
export type UpdateTrailBody = z.infer<typeof updateTrailBodySchema>;

export const listTrailsQuerySchema = paginationQuerySchema.extend({
  title: z.string().trim().min(1).optional(),
  isPublished: z.coerce.boolean().optional(),
  isActive: z.coerce.boolean().optional(),
  includeDeleted: z.coerce.boolean().optional(),
  includeItems: z.coerce.boolean().optional(),
});
export type ListTrailsQuery = z.infer<typeof listTrailsQuerySchema>;

export const createTrailItemBodySchema = z.object({
  contentType: contentTypeSchema,
  contentId: z.string().trim().min(1),
  position: z.number().int().positive(),
  isRequired: z.boolean().optional(),
  isActive: z.boolean().optional(),
});
export type CreateTrailItemBody = z.infer<typeof createTrailItemBodySchema>;

export const updateTrailItemBodySchema = createTrailItemBodySchema.partial();
export type UpdateTrailItemBody = z.infer<typeof updateTrailItemBodySchema>;

export const paginatedTrailsSchema = z.object({
  items: z.array(trailSchema),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});
export type PaginatedTrails = z.infer<typeof paginatedTrailsSchema>;
