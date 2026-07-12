import { FastifyInstance } from "fastify";

import { createAnalyticsEvent, getClickSummary } from "./analytics.service";
import {
  AnalyticsEventBody,
  analyticsEventBodySchema,
  analyticsEventSchema,
  Result,
  resultSchema,
} from "@/packages/schemas";

export default async function analyticsRoute(app: FastifyInstance) {
  app.get(
    "/analytics/click-summary",
    {
      schema: {
        description: "Retorna um resumo dos cliques.",
        tags: ["Analytics"],
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                targetId: { type: "string", nullable: true },
                clicks: { type: "number" },
              },
            },
          },
        },
      },
    },
    async (_, reply) => {
      const clickSummary = await getClickSummary();

      const result: Result = {
        success: true,
        data: clickSummary,
        code: 200,
      };

      return reply.code(200).send(result);
    },
  );

  app.post<{ Body: AnalyticsEventBody; Reply: Result }>(
    "/analytics/events",
    {
      schema: {
        description:
          "Registra um evento de analytics. Pode ser usado para rastrear cliques, visualizações de página e outros eventos.",
        tags: ["Analytics"],
        body: analyticsEventBodySchema,
        response: {
          201: resultSchema(analyticsEventSchema),
        },
      },
    },
    async (req, reply) => {
      const sessionUser = req.sessionUser;
      const analyticsEvent = await createAnalyticsEvent(
        req.body,
        sessionUser?.user.id,
      );

      const result: Result = {
        success: true,
        data: analyticsEvent,
        code: 201,
      };

      return reply.code(201).send(result);
    },
  );
}
