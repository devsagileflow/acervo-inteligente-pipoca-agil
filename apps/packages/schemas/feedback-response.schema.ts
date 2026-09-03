import { z } from "zod";
import { contentTypeSchema } from "./content.schema";

export const feedbackAnswerValueSchema = z.union([
  z.number().int().positive(),
  z.string(),
  z.boolean(),
]);
export type FeedbackAnswerValue = z.infer<typeof feedbackAnswerValueSchema>;

export const feedbackAnswerSchema = z.object({
  id: z.string(),
  responseId: z.string(),
  questionId: z.string(),
  value: feedbackAnswerValueSchema.nullish(),
  selectedOptionIds: z.array(z.string()).optional(),
  deletedAt: z.coerce.date().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type FeedbackAnswer = z.infer<typeof feedbackAnswerSchema>;

export const feedbackResponseSchema = z.object({
  id: z.string(),
  formId: z.string(),
  userId: z.string().nullish(),
  contentType: contentTypeSchema.nullish(),
  contentId: z.string().nullish(),
  deletedAt: z.coerce.date().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  answers: z.array(feedbackAnswerSchema).optional(),
});
export type FeedbackResponse = z.infer<typeof feedbackResponseSchema>;
