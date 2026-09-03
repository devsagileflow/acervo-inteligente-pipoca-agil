import { ContentType, PrismaClient, QuestionType } from "@prisma/client";

const GLOBAL_TRAIL_FORM_ID = "feedback-form-global-trail";

type SeedOption = {
  id: string;
  label: string;
  position: number;
};

type SeedQuestion = {
  id: string;
  questionType: QuestionType;
  label: string;
  isRequired: boolean;
  position: number;
  options?: SeedOption[];
};

type SeedForm = {
  id: string;
  title: string;
  description?: string;
  contentType?: ContentType;
  contentId?: string;
  questions: SeedQuestion[];
};

const GLOBAL_TRAIL_FORM: SeedForm = {
  id: GLOBAL_TRAIL_FORM_ID,
  title: "Avaliação da Trilha",
  description:
    "Sua opinião sobre esta trilha nos ajuda a melhorar os próximos conteúdos.",
  contentType: ContentType.TRAIL,
  questions: [
    {
      id: "feedback-question-global-trail-01",
      questionType: QuestionType.STARS,
      label: "Como você avalia a sua experiência até agora?",
      isRequired: true,
      position: 1,
    },
    {
      id: "feedback-question-global-trail-02",
      questionType: QuestionType.TEXT,
      label: "O que mais chamou sua atenção?",
      isRequired: false,
      position: 2,
    },
    {
      id: "feedback-question-global-trail-03",
      questionType: QuestionType.TEXT,
      label: "Teve algo confuso ou difícil de entender?",
      isRequired: false,
      position: 3,
    },
    {
      id: "feedback-question-global-trail-04",
      questionType: QuestionType.TEXT,
      label:
        "Você utilizaria esta plataforma para aprender Agilidade? Por quê?",
      isRequired: false,
      position: 4,
    },
    {
      id: "feedback-question-global-trail-05",
      questionType: QuestionType.TEXT,
      label: "O que poderíamos melhorar?",
      isRequired: false,
      position: 5,
    },
  ],
};

async function seedForm(prisma: PrismaClient, form: SeedForm) {
  await prisma.feedbackForm.upsert({
    where: { id: form.id },
    update: {
      title: form.title,
      description: form.description,
      contentType: form.contentType ?? null,
      contentId: form.contentId ?? null,
      isPublished: true,
      isActive: true,
      deletedAt: null,
    },
    create: {
      id: form.id,
      title: form.title,
      description: form.description,
      contentType: form.contentType ?? null,
      contentId: form.contentId ?? null,
      isPublished: true,
      isActive: true,
    },
  });

  for (const question of form.questions) {
    await prisma.feedbackQuestion.upsert({
      where: { id: question.id },
      update: {
        formId: form.id,
        questionType: question.questionType,
        label: question.label,
        isRequired: question.isRequired,
        position: question.position,
        deletedAt: null,
      },
      create: {
        id: question.id,
        formId: form.id,
        questionType: question.questionType,
        label: question.label,
        isRequired: question.isRequired,
        position: question.position,
      },
    });

    for (const option of question.options ?? []) {
      await prisma.feedbackQuestionOption.upsert({
        where: { id: option.id },
        update: {
          questionId: question.id,
          label: option.label,
          position: option.position,
          deletedAt: null,
        },
        create: {
          id: option.id,
          questionId: question.id,
          label: option.label,
          position: option.position,
        },
      });
    }
  }
}

export async function seedFeedbackForms(prisma: PrismaClient) {
  await prisma.$transaction(async (tx) => {
    await seedForm(tx as PrismaClient, GLOBAL_TRAIL_FORM);
  });
}
