import { z } from "zod";

import { feedbackFormSchema } from "./feedback-form.schema";
import { paginationQuerySchema } from "./content.schema";

export const listFeedbackFormsQuerySchema = paginationQuerySchema.extend({
  contentType: z.enum(["VIDEO", "TRAIL"]).optional(),
  contentId: z.string().trim().min(1).optional(),
});
export type ListFeedbackFormsQuery = z.infer<
  typeof listFeedbackFormsQuerySchema
>;

export const feedbackFormParamsSchema = z.object({
  formId: z.string(),
});
export type FeedbackFormParams = z.infer<typeof feedbackFormParamsSchema>;

export const paginatedFeedbackFormsSchema = z.object({
  items: z.array(feedbackFormSchema),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});
export type PagedFeedbackFormsResponse = z.infer<
  typeof paginatedFeedbackFormsSchema
>;
