import { z } from "zod";

import { feedbackResponseSchema } from "./feedback-response.schema";

const answerBaseSchema = z.object({
  questionId: z.string().trim().min(1),
});

export const starsAnswerSchema = answerBaseSchema.extend({
  type: z.literal("STARS"),
  value: z.number().int().min(1).max(5),
});

export const scaleAnswerSchema = answerBaseSchema.extend({
  type: z.literal("SCALE_0_10"),
  value: z.number().int().min(0).max(10),
});

export const likeDislikeAnswerSchema = answerBaseSchema.extend({
  type: z.literal("LIKE_DISLIKE"),
  value: z.enum(["like", "dislike"]),
});

export const textAnswerSchema = answerBaseSchema.extend({
  type: z.literal("TEXT"),
  value: z.string().trim().min(1),
});

export const multipleChoiceAnswerSchema = answerBaseSchema.extend({
  type: z.literal("MULTIPLE_CHOICE"),
  optionIds: z.array(z.string().trim().min(1)).min(1),
});

export const singleChoiceAnswerSchema = answerBaseSchema.extend({
  type: z.literal("SINGLE_CHOICE"),
  optionId: z.string().trim().min(1),
});

export const feedbackAnswerInputSchema = z.discriminatedUnion("type", [
  starsAnswerSchema,
  scaleAnswerSchema,
  likeDislikeAnswerSchema,
  textAnswerSchema,
  multipleChoiceAnswerSchema,
  singleChoiceAnswerSchema,
]);
export type FeedbackAnswerInput = z.infer<typeof feedbackAnswerInputSchema>;

export const createFeedbackResponseBodySchema = z.object({
  answers: z.array(feedbackAnswerInputSchema).min(1),
});
export type CreateFeedbackResponseBody = z.infer<
  typeof createFeedbackResponseBodySchema
>;

export const createFeedbackResponseResponseSchema = feedbackResponseSchema;
export type CreateFeedbackResponseResponse = z.infer<
  typeof createFeedbackResponseResponseSchema
>;
