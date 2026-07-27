import { z } from "zod";

const youtubeUrlPattern =
  /^(https?:\/\/)?((www|m)\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[A-Za-z0-9_-]{11}([&?].*)?$/i;

export const contentTypeSchema = z.enum(["VIDEO"]);
export type ContentType = z.infer<typeof contentTypeSchema>;

export const youtubeUrlSchema = z
  .string()
  .trim()
  .regex(youtubeUrlPattern, "URL do YouTube inválida");

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
});
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
