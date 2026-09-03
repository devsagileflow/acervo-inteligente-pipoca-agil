import prisma from "@/lib/prisma";
import {
  FeedbackForm,
  ListFeedbackFormsQuery,
  PaginatedFeedbackFormsResponse,
} from "@/packages/schemas";

const PUBLIC_FORM_WHERE = {
  isPublished: true,
  isActive: true,
  deletedAt: null,
} as const;

export const listFeedbackForms = async (
  query: ListFeedbackFormsQuery,
): Promise<PaginatedFeedbackFormsResponse> => {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 10;
  const where = {
    ...PUBLIC_FORM_WHERE,
    contentType: query.contentType,
    contentId: query.contentId,
  };
  const [forms, total] = await prisma.$transaction([
    prisma.feedbackForm.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.feedbackForm.count({ where }),
  ]);

  return {
    items: forms as FeedbackForm[],
    page,
    pageSize,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / pageSize),
  };
};

export const getFeedbackFormById = async (
  formId: string,
): Promise<FeedbackForm | null> => {
  const form = await prisma.feedbackForm.findFirst({
    where: { id: formId, ...PUBLIC_FORM_WHERE },
    include: {
      questions: {
        where: { deletedAt: null },
        orderBy: [{ position: "asc" }, { createdAt: "asc" }],
        include: {
          options: {
            where: { deletedAt: null },
            orderBy: [{ position: "asc" }, { createdAt: "asc" }],
          },
        },
      },
    },
  });

  return form as FeedbackForm | null;
};
