import { FastifyInstance } from "fastify";
import { NotFound } from "http-errors";

import { createFeedbackResponse } from "./feedback-response.service";
import {
  CreateFeedbackResponseBody,
  createFeedbackResponseBodySchema,
  FeedbackFormParams,
  feedbackFormParamsSchema,
  FeedbackResponse,
  feedbackResponseSchema,
  Result,
  resultSchema,
} from "@/packages/schemas";

export default async function feedbackResponseRoute(app: FastifyInstance) {
  app.post<{
    Body: CreateFeedbackResponseBody;
    Params: FeedbackFormParams;
    Reply: Result<FeedbackResponse>;
  }>(
    "/feedback-forms/:formId/responses",
    {
      schema: {
        description:
          "Envia respostas para um formulário de feedback publicado. Aceita usuários logados (via sessão) e anônimos.",
        tags: ["Feedback"],
        params: feedbackFormParamsSchema,
        body: createFeedbackResponseBodySchema,
        response: {
          201: resultSchema(feedbackResponseSchema),
        },
      },
    },
    async (req, reply) => {
      const response = await createFeedbackResponse(
        req.params.formId,
        req.body,
        req.sessionUser?.user.id,
      );
      if (!response) throw new NotFound("FEEDBACK_FORM_NOT_FOUND");

      return reply.code(201).send({ success: true, data: response, code: 201 });
    },
  );
}
