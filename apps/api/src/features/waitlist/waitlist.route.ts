import { FastifyInstance } from "fastify";

import { createWaitlistEntry, listWaitlistEntries } from "./waitlist.service";
import { requireAdminSession } from "@/lib/session";
import {
  CreateWaitlistBody,
  createWaitlistBodySchema,
  ListWaitlistQuery,
  listWaitlistQuerySchema,
  PaginatedWaitlist,
  paginatedWaitlistSchema,
  Result,
  resultSchema,
  Waitlist,
  waitlistSchema,
} from "@/packages/schemas";

export default async function waitlistRoute(app: FastifyInstance) {
  app.post<{ Body: CreateWaitlistBody; Reply: Result<Waitlist> }>(
    "/waitlist",
    {
      schema: {
        description: "Inscreve um visitante na waitlist (público, sem autenticação).",
        tags: ["Waitlist"],
        body: createWaitlistBodySchema,
        response: {
          200: resultSchema(waitlistSchema),
          201: resultSchema(waitlistSchema),
        },
      },
    },
    async (req, reply) => {
      const { waitlist, isNew } = await createWaitlistEntry(req.body);

      return reply
        .code(isNew ? 201 : 200)
        .send({ success: true, data: waitlist, code: isNew ? 201 : 200 });
    },
  );

  app.get<{ Querystring: ListWaitlistQuery; Reply: Result<PaginatedWaitlist> }>(
    "/waitlist",
    {
      schema: {
        description: "Lista as inscrições da waitlist (somente ADMIN).",
        tags: ["Waitlist"],
        querystring: listWaitlistQuerySchema,
        response: {
          200: resultSchema(paginatedWaitlistSchema),
        },
      },
    },
    async (req, reply) => {
      await requireAdminSession(req);

      const data = await listWaitlistEntries(req.query);
      return reply.send({ success: true, data, code: 200 });
    },
  );
}
