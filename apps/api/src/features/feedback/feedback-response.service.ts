import { Prisma } from "@prisma/client";
import { BadRequest } from "http-errors";

import prisma from "@/lib/prisma";
import {
  CreateFeedbackResponseBody,
  FeedbackAnswerInput,
  FeedbackResponse,
} from "@/packages/schemas";

type QuestionWithOptions = Prisma.FeedbackQuestionGetPayload<{
  include: { options: true };
}>;

const loadPublicFormWithQuestions = async (formId: string) => {
  return prisma.feedbackForm.findFirst({
    where: {
      id: formId,
      isPublished: true,
      isActive: true,
      deletedAt: null,
    },
    include: {
      questions: {
        where: { deletedAt: null },
        include: { options: { where: { deletedAt: null } } },
      },
    },
  });
};

const validateAnswers = (
  questions: QuestionWithOptions[],
  answers: FeedbackAnswerInput[],
): Map<string, FeedbackAnswerInput> => {
  const questionsById = new Map(questions.map((q) => [q.id, q]));
  const answersByQuestionId = new Map<string, FeedbackAnswerInput>();

  for (const answer of answers) {
    const question = questionsById.get(answer.questionId);
    if (!question)
      throw new BadRequest(`UNKNOWN_QUESTION: ${answer.questionId}`);

    if (answersByQuestionId.has(answer.questionId))
      throw new BadRequest(`DUPLICATE_ANSWER: ${answer.questionId}`);

    if (answer.type !== question.questionType)
      throw new BadRequest(`ANSWER_TYPE_MISMATCH: ${answer.questionId}`);

    if (answer.type === "MULTIPLE_CHOICE" || answer.type === "SINGLE_CHOICE") {
      const validOptionIds = new Set(question.options.map((o) => o.id));
      const selected =
        answer.type === "MULTIPLE_CHOICE"
          ? answer.optionIds
          : [answer.optionId];
      const invalid = selected.filter((id) => !validOptionIds.has(id));
      if (invalid.length > 0)
        throw new BadRequest(
          `INVALID_OPTION: ${answer.questionId} (${invalid.join(", ")})`,
        );
    }
    answersByQuestionId.set(answer.questionId, answer);
  }

  const missingRequired = questions
    .filter((q) => q.isRequired && !answersByQuestionId.has(q.id))
    .map((q) => q.id);

  if (missingRequired.length > 0) {
    throw new BadRequest(
      `REQUIRED_QUESTIONS_MISSING: ${missingRequired.join(", ")}`,
    );
  }

  return answersByQuestionId;
};

export const createFeedbackResponse = async (
  formId: string,
  body: CreateFeedbackResponseBody,
  userId?: string,
): Promise<FeedbackResponse | null> => {
  const form = await loadPublicFormWithQuestions(formId);
  if (!form) return null;

  const answersByQuestionId = validateAnswers(form.questions, body.answers);

  const response = await prisma.$transaction(async (tx) => {
    const created = await tx.feedbackResponse.create({
      data: {
        formId,
        userId: userId ?? null,
      },
    });

    await tx.feedbackAnswer.createMany({
      data: [...answersByQuestionId.values()].map((answer) => ({
        responseId: created.id,
        questionId: answer.questionId,
        value:
          "value" in answer
            ? (answer.value as Prisma.InputJsonValue)
            : undefined,
        selectedOptionIds:
          answer.type === "MULTIPLE_CHOICE"
            ? answer.optionIds
            : answer.type === "SINGLE_CHOICE"
              ? [answer.optionId]
              : [],
      })),
    });

    return tx.feedbackResponse.findUniqueOrThrow({
      where: { id: created.id },
      include: { answers: true },
    });
  });

  return response as FeedbackResponse;
};
