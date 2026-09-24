import { z } from "zod";

import { paginationQuerySchema } from "./content.schema";
import { waitlistRoleSchema, waitlistSchema } from "./waitlist.schema";

export const createWaitlistBodySchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  role: waitlistRoleSchema.optional(),
  message: z.string().trim().min(1).optional(),
});
export type CreateWaitlistBody = z.infer<typeof createWaitlistBodySchema>;

export const listWaitlistQuerySchema = paginationQuerySchema;
export type ListWaitlistQuery = z.infer<typeof listWaitlistQuerySchema>;

export const paginatedWaitlistSchema = z.object({
  items: z.array(waitlistSchema),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});
export type PaginatedWaitlist = z.infer<typeof paginatedWaitlistSchema>;
