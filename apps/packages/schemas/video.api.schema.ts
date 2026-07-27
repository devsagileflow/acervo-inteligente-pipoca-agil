import { z } from "zod";

import { paginationQuerySchema, youtubeUrlSchema } from "./content.schema";

export const videoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullish(),
  youtubeUrl: z.string(),
  durationInSeconds: z.number().int().positive(),
  isActive: z.boolean(),
  deletedAt: z.coerce.date().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type Video = z.infer<typeof videoSchema>;

export const videoParamsSchema = z.object({
  videoId: z.string(),
});
export type VideoParams = z.infer<typeof videoParamsSchema>;

export const createVideoBodySchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1).optional(),
  youtubeUrl: youtubeUrlSchema,
  durationInSeconds: z.number().int().positive(),
  isActive: z.boolean().optional(),
});
export type CreateVideoBody = z.infer<typeof createVideoBodySchema>;

export const updateVideoBodySchema = createVideoBodySchema.partial();
export type UpdateVideoBody = z.infer<typeof updateVideoBodySchema>;

export const listVideosQuerySchema = paginationQuerySchema.extend({
  title: z.string().trim().min(1).optional(),
  isActive: z.coerce.boolean().optional(),
  includeDeleted: z.coerce.boolean().optional(),
});
export type ListVideosQuery = z.infer<typeof listVideosQuerySchema>;

export const paginatedVideosSchema = z.object({
  items: z.array(videoSchema),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});
export type PaginatedVideos = z.infer<typeof paginatedVideosSchema>;
