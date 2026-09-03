import { FastifyInstance } from "fastify";
import { NotFound } from "http-errors";

import {
  getFeedbackFormById,
  listFeedbackForms,
} from "./feedback-form.service";
import {
  FeedbackForm,
  FeedbackFormParams,
  feedbackFormParamsSchema,
  feedbackFormSchema,
  ListFeedbackFormsQuery,
  listFeedbackFormsQuerySchema,
  PaginatedFeedbackFormsResponse,
  paginatedFeedbackFormsSchema,
  Result,
  resultSchema,
} from "@/packages/schemas";

export default async function feedbackFormRoute(app: FastifyInstance) {
  app.get<{
    Querystring: ListFeedbackFormsQuery;
    Reply: Result<PaginatedFeedbackFormsResponse>;
  }>(
    "/feedback-forms",
    {
      schema: {
        description:
          "Lista formulários de feedback publicados, com filtro opcional por vínculo de conteúdo.",
        tags: ["Feedback"],
        querystring: listFeedbackFormsQuerySchema,
        response: {
          200: resultSchema(paginatedFeedbackFormsSchema),
        },
      },
    },
    async (req, reply) => {
      const data = await listFeedbackForms(req.query);
      return reply.send({ success: true, data, code: 200 });
    },
  );

  app.get<{ Params: FeedbackFormParams; Reply: Result<FeedbackForm> }>(
    "/feedback-forms/:formId",
    {
      schema: {
        description:
          "Obtém um formulário de feedback publicado por id, incluindo perguntas ordenadas e opções.",
        tags: ["Feedback"],
        params: feedbackFormParamsSchema,
        response: {
          200: resultSchema(feedbackFormSchema),
        },
      },
    },
    async (req, reply) => {
      const form = await getFeedbackFormById(req.params.formId);
      if (!form) throw new NotFound("FEEDBACK_FORM_NOT_FOUND");

      return reply.send({ success: true, data: form, code: 200 });
    },
  );
}
