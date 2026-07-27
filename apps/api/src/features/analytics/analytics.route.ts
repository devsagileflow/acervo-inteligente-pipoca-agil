import { FastifyInstance } from "fastify";

import { createAnalyticsEvent, getAnalyticsEvents } from "./analytics.service";
import {
  AnalyticsEventBody,
  analyticsEventBodySchema,
  analyticsEventSchema,
  Result,
  resultSchema,
} from "@/packages/schemas";

export default async function analyticsRoute(app: FastifyInstance) {
  app.get(
    "/analytics",
    {
      schema: {
        description: "Retorna todos os eventos de analytics.",
        tags: ["Analytics"],
        response: {
          200: resultSchema(analyticsEventSchema.array()),
        },
      },
    },
    async (_, reply) => {
      const analyticsEvents = await getAnalyticsEvents();

      const result: Result = {
        success: true,
        data: analyticsEvents,
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
