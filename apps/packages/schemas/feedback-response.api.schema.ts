import { z } from "zod";

import { feedbackResponseSchema } from "./feedback-response.schema";
import { contentTypeSchema } from "./content.schema";

const answerBaseSchema = z.object({
  questionId: z.string().trim().min(1),
});

export const starsAnswerSchema = answerBaseSchema
  .extend({
    type: z.literal("STARS"),
    value: z.number().int().min(0).max(5),
    isRequired: z.boolean(),
  })
  .refine((data) => !data.isRequired || (data.value >= 1 && data.value <= 5), {
    message: "Valor deve estar entre 1 e 5 se a pergunta for obrigatória",
  });

export const scaleAnswerSchema = answerBaseSchema
  .extend({
    type: z.literal("SCALE_0_10"),
    value: z.number().int().min(0).max(10),
    isRequired: z.boolean(),
  })
  .refine((data) => !data.isRequired || (data.value >= 0 && data.value <= 10), {
    message: "Valor deve estar entre 0 e 10 se a pergunta for obrigatória",
  });

export const likeDislikeAnswerSchema = answerBaseSchema
  .extend({
    type: z.literal("LIKE_DISLIKE"),
    value: z.enum(["like", "dislike"]),
    isRequired: z.boolean(),
  })
  .refine(
    (data) =>
      !data.isRequired || data.value === "like" || data.value === "dislike",
    {
      message:
        "Valor deve ser 'like' ou 'dislike' se a pergunta for obrigatória",
    },
  );

export const textAnswerSchema = answerBaseSchema
  .extend({
    type: z.literal("TEXT"),
    value: z.string(),
    isRequired: z.boolean(),
  })
  .refine((data) => !data.isRequired || data.value.trim().length > 0, {
    message: "O valor deve ser preenchido se a pergunta for obrigatória",
  });

export const multipleChoiceAnswerSchema = answerBaseSchema
  .extend({
    type: z.literal("MULTIPLE_CHOICE"),
    optionIds: z.array(z.string().trim().min(1)).min(1),
    isRequired: z.boolean(),
  })
  .refine((data) => !data.isRequired || data.optionIds.length > 0, {
    message:
      "Deve selecionar pelo menos uma opção se a pergunta for obrigatória",
  });

export const singleChoiceAnswerSchema = answerBaseSchema
  .extend({
    type: z.literal("SINGLE_CHOICE"),
    optionId: z.string().trim().min(1),
    isRequired: z.boolean(),
  })
  .refine((data) => !data.isRequired || data.optionId.trim().length > 0, {
    message: "Deve selecionar uma opção se a pergunta for obrigatória",
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
  contentType: contentTypeSchema.nullish(),
  contentId: z.string().nullish(),
});
export type CreateFeedbackResponseBody = z.infer<
  typeof createFeedbackResponseBodySchema
>;

export const createFeedbackResponseResponseSchema = feedbackResponseSchema;
export type CreateFeedbackResponseResponse = z.infer<
  typeof createFeedbackResponseResponseSchema
>;
