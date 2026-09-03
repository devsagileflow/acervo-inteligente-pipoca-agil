import { z } from "zod";

export const questionTypeSchema = z.enum([
  "STARS",
  "SCALE_0_10",
  "LIKE_DISLIKE",
  "TEXT",
  "MULTIPLE_CHOICE",
  "SINGLE_CHOICE",
]);
export type QuestionType = z.infer<typeof questionTypeSchema>;

export const feedbackQuestionOptionSchema = z.object({
  id: z.string(),
  questionId: z.string(),
  label: z.string(),
  position: z.number().int().positive(),
  deletedAt: z.coerce.date().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type FeedbackQuestionOption = z.infer<
  typeof feedbackQuestionOptionSchema
>;

const feedbackQuestionBaseSchema = z.object({
  id: z.string(),
  formId: z.string(),
  label: z.string(),
  isRequired: z.boolean(),
  position: z.number().int().positive(),
  deletedAt: z.coerce.date().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const feedbackQuestionSchema = z.discriminatedUnion("questionType", [
  feedbackQuestionBaseSchema.extend({
    questionType: z.literal("STARS"),
    options: z.array(feedbackQuestionOptionSchema).optional(),
  }),
  feedbackQuestionBaseSchema.extend({
    questionType: z.literal("SCALE_0_10"),
    options: z.array(feedbackQuestionOptionSchema).optional(),
  }),
  feedbackQuestionBaseSchema.extend({
    questionType: z.literal("LIKE_DISLIKE"),
    options: z.array(feedbackQuestionOptionSchema).optional(),
  }),
  feedbackQuestionBaseSchema.extend({
    questionType: z.literal("TEXT"),
    options: z.array(feedbackQuestionOptionSchema).optional(),
  }),
  feedbackQuestionBaseSchema.extend({
    questionType: z.literal("MULTIPLE_CHOICE"),
    options: z.array(feedbackQuestionOptionSchema),
  }),
  feedbackQuestionBaseSchema.extend({
    questionType: z.literal("SINGLE_CHOICE"),
    options: z.array(feedbackQuestionOptionSchema),
  }),
]);
export type FeedbackQuestion = z.infer<typeof feedbackQuestionSchema>;

export const feedbackFormSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullish(),
  contentType: z.enum(["VIDEO", "TRAIL"]).nullish(),
  contentId: z.string().nullish(),
  isPublished: z.boolean(),
  isActive: z.boolean(),
  deletedAt: z.coerce.date().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  questions: z.array(feedbackQuestionSchema).optional(),
});
export type FeedbackForm = z.infer<typeof feedbackFormSchema>;
