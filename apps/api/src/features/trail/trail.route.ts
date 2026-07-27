import { FastifyInstance } from "fastify";
import { NotFound } from "http-errors";

import { getTrailById, listTrails } from "./trail.service";
import { isAdminSession } from "@/lib/session";
import {
  ListTrailsQuery,
  listTrailsQuerySchema,
  PaginatedTrails,
  paginatedTrailsSchema,
  Result,
  resultSchema,
  Trail,
  trailParamsSchema,
  TrailParams,
  trailSchema,
} from "@/packages/schemas";

export default async function trailRoute(app: FastifyInstance) {
  app.get<{ Querystring: ListTrailsQuery; Reply: Result<PaginatedTrails> }>(
    "/trails",
    {
      schema: {
        description:
          "Lista trilhas com leitura pública para registros publicados.",
        tags: ["Trails"],
        querystring: listTrailsQuerySchema,
        response: {
          200: resultSchema(paginatedTrailsSchema),
        },
      },
    },
    async (req, reply) => {
      const isAdmin = await isAdminSession(req.sessionUser?.user.id);
      const data = await listTrails(req.query, isAdmin);
      return reply.send({ success: true, data, code: 200 });
    },
  );

  app.get<{ Params: TrailParams; Reply: Result<Trail> }>(
    "/trails/:trailId",
    {
      schema: {
        description: "Obtém uma trilha por id.",
        tags: ["Trails"],
        params: trailParamsSchema,
        response: {
          200: resultSchema(trailSchema),
        },
      },
    },
    async (req, reply) => {
      const trail = await getTrailById(
        req.params.trailId,
        await isAdminSession(req.sessionUser?.user.id),
      );
      if (!trail) throw new NotFound("TRAIL_NOT_FOUND");

      return reply.send({ success: true, data: trail, code: 200 });
    },
  );

  // app.post<{ Body: CreateTrailBody; Reply: Result<Trail> }>(
  //   "/trails",
  //   {
  //     schema: {
  //       description: "Cria uma trilha.",
  //       tags: ["Trails"],
  //       body: createTrailBodySchema,
  //       response: {
  //         201: resultSchema(trailSchema),
  //       },
  //     },
  //   },
  //   async (req, reply) => {
  //     await requireAdminSession(req);

  //     const trail = await createTrail(req.body);
  //     return reply.code(201).send({ success: true, data: trail, code: 201 });
  //   },
  // );

  // app.put<{ Body: UpdateTrailBody; Params: TrailParams; Reply: Result<Trail> }>(
  //   "/trails/:trailId",
  //   {
  //     schema: {
  //       description: "Atualiza parcialmente uma trilha.",
  //       tags: ["Trails"],
  //       params: trailParamsSchema,
  //       body: updateTrailBodySchema,
  //       response: {
  //         200: resultSchema(trailSchema),
  //       },
  //     },
  //   },
  //   async (req, reply) => {
  //     await requireAdminSession(req);

  //     const trail = await updateTrail(req.params.trailId, req.body);
  //     if (!trail) throw new NotFound("TRAIL_NOT_FOUND");

  //     return reply.send({ success: true, data: trail, code: 200 });
  //   },
  // );

  // app.delete<{ Params: TrailParams; Reply: Result<Trail> }>(
  //   "/trails/:trailId",
  //   {
  //     schema: {
  //       description: "Remove logicamente uma trilha.",
  //       tags: ["Trails"],
  //       params: trailParamsSchema,
  //       response: {
  //         200: resultSchema(trailSchema),
  //       },
  //     },
  //   },
  //   async (req, reply) => {
  //     await requireAdminSession(req);

  //     const trail = await softDeleteTrail(req.params.trailId);
  //     if (!trail) throw new NotFound("TRAIL_NOT_FOUND");

  //     return reply.send({ success: true, data: trail, code: 200 });
  //   },
  // );

  // app.post<{
  //   Body: CreateTrailItemBody;
  //   Params: TrailParams;
  //   Reply: Result<TrailItem>;
  // }>(
  //   "/trails/:trailId/items",
  //   {
  //     schema: {
  //       description: "Adiciona um item ordenado à trilha.",
  //       tags: ["Trail Items"],
  //       params: trailParamsSchema,
  //       body: createTrailItemBodySchema,
  //       response: {
  //         201: resultSchema(trailItemSchema),
  //       },
  //     },
  //   },
  //   async (req, reply) => {
  //     await requireAdminSession(req);

  //     const item = await addTrailItem(req.params.trailId, req.body);
  //     if (!item) throw new NotFound("TRAIL_OR_CONTENT_NOT_FOUND");

  //     return reply.code(201).send({ success: true, data: item, code: 201 });
  //   },
  // );

  // app.put<{
  //   Body: UpdateTrailItemBody;
  //   Params: TrailItemParams;
  //   Reply: Result<TrailItem>;
  // }>(
  //   "/trails/:trailId/items/:itemId",
  //   {
  //     schema: {
  //       description:
  //         "Atualiza um item da trilha mantendo ordenação consistente.",
  //       tags: ["Trail Items"],
  //       params: trailItemParamsSchema,
  //       body: updateTrailItemBodySchema,
  //       response: {
  //         200: resultSchema(trailItemSchema),
  //       },
  //     },
  //   },
  //   async (req, reply) => {
  //     await requireAdminSession(req);

  //     const item = await updateTrailItem(
  //       req.params.trailId,
  //       req.params.itemId,
  //       req.body,
  //     );
  //     if (!item) throw new NotFound("TRAIL_ITEM_NOT_FOUND");

  //     return reply.send({ success: true, data: item, code: 200 });
  //   },
  // );

  // app.delete<{ Params: TrailItemParams; Reply: Result<TrailItem> }>(
  //   "/trails/:trailId/items/:itemId",
  //   {
  //     schema: {
  //       description: "Remove logicamente um item da trilha.",
  //       tags: ["Trail Items"],
  //       params: trailItemParamsSchema,
  //       response: {
  //         200: resultSchema(trailItemSchema),
  //       },
  //     },
  //   },
  //   async (req, reply) => {
  //     await requireAdminSession(req);

  //     const item = await removeTrailItem(req.params.trailId, req.params.itemId);
  //     if (!item) throw new NotFound("TRAIL_ITEM_NOT_FOUND");

  //     return reply.send({ success: true, data: item, code: 200 });
  //   },
  // );

  // app.get<{
  //   Params: TrailProgressParams;
  //   Reply: Result<TrailProgressDetails>;
  // }>(
  //   "/trails/:trailId/progress",
  //   {
  //     schema: {
  //       description: "Obtém o progresso do usuário autenticado em uma trilha.",
  //       tags: ["Trail Progress"],
  //       params: trailProgressParamsSchema,
  //       response: {
  //         200: resultSchema(trailProgressDetailsSchema),
  //       },
  //     },
  //   },
  //   async (req, reply) => {
  //     const sessionUser = requireSessionUser(req);

  //     const progress = await getTrailProgress(
  //       sessionUser.user.id,
  //       req.params.trailId,
  //     );
  //     if (!progress) throw new NotFound("TRAIL_PROGRESS_NOT_FOUND");

  //     return reply.send({ success: true, data: progress, code: 200 });
  //   },
  // );

  // app.post<{
  //   Body: MarkTrailItemViewedBody;
  //   Params: TrailProgressParams;
  //   Reply: Result<TrailProgressDetails>;
  // }>(
  //   "/trails/:trailId/progress/view",
  //   {
  //     schema: {
  //       description:
  //         "Registra visualização de item e recalcula o progresso da trilha.",
  //       tags: ["Trail Progress"],
  //       params: trailProgressParamsSchema,
  //       body: markTrailItemViewedBodySchema,
  //       response: {
  //         200: resultSchema(trailProgressDetailsSchema),
  //       },
  //     },
  //   },
  //   async (req, reply) => {
  //     const sessionUser = requireSessionUser(req);

  //     const progress = await markTrailItemViewed(
  //       sessionUser.user.id,
  //       req.params.trailId,
  //       req.body,
  //     );
  //     if (!progress) throw new NotFound("TRAIL_ITEM_NOT_FOUND");

  //     return reply.send({ success: true, data: progress, code: 200 });
  //   },
  // );
}
