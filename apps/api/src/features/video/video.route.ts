import { FastifyInstance } from "fastify";
import { NotFound } from "http-errors";

import {
  createVideo,
  getVideoById,
  listVideos,
  softDeleteVideo,
  updateVideo,
} from "./video.service";
import { isAdminSession, requireAdminSession } from "@/lib/session";
import {
  CreateVideoBody,
  createVideoBodySchema,
  ListVideosQuery,
  listVideosQuerySchema,
  PaginatedVideos,
  paginatedVideosSchema,
  Result,
  resultSchema,
  UpdateVideoBody,
  updateVideoBodySchema,
  Video,
  videoParamsSchema,
  VideoParams,
  videoSchema,
} from "@/packages/schemas";

export default async function videoRoute(app: FastifyInstance) {
  app.get<{ Querystring: ListVideosQuery; Reply: Result<PaginatedVideos> }>(
    "/videos",
    {
      schema: {
        description: "Lista vídeos com leitura pública para registros ativos.",
        tags: ["Videos"],
        querystring: listVideosQuerySchema,
        response: {
          200: resultSchema(paginatedVideosSchema),
        },
      },
    },
    async (req, reply) => {
      const data = await listVideos(
        req.query,
        await isAdminSession(req.sessionUser?.user.id),
      );

      return reply.send({ success: true, data, code: 200 });
    },
  );

  app.get<{ Params: VideoParams; Reply: Result<Video> }>(
    "/videos/:videoId",
    {
      schema: {
        description: "Obtém um vídeo por id.",
        tags: ["Videos"],
        params: videoParamsSchema,
        response: {
          200: resultSchema(videoSchema),
        },
      },
    },
    async (req, reply) => {
      const video = await getVideoById(
        req.params.videoId,
        await isAdminSession(req.sessionUser?.user.id),
      );
      if (!video) throw new NotFound("VIDEO_NOT_FOUND");

      return reply.send({ success: true, data: video, code: 200 });
    },
  );

  app.post<{ Body: CreateVideoBody; Reply: Result<Video> }>(
    "/videos",
    {
      schema: {
        description: "Cria um vídeo.",
        tags: ["Videos"],
        body: createVideoBodySchema,
        response: {
          201: resultSchema(videoSchema),
        },
      },
    },
    async (req, reply) => {
      await requireAdminSession(req);

      const video = await createVideo(req.body);
      return reply.code(201).send({ success: true, data: video, code: 201 });
    },
  );

  app.put<{ Body: UpdateVideoBody; Params: VideoParams; Reply: Result<Video> }>(
    "/videos/:videoId",
    {
      schema: {
        description: "Atualiza parcialmente um vídeo.",
        tags: ["Videos"],
        params: videoParamsSchema,
        body: updateVideoBodySchema,
        response: {
          200: resultSchema(videoSchema),
        },
      },
    },
    async (req, reply) => {
      await requireAdminSession(req);

      const video = await updateVideo(req.params.videoId, req.body);
      if (!video) throw new NotFound("VIDEO_NOT_FOUND");

      return reply.send({ success: true, data: video, code: 200 });
    },
  );

  app.delete<{ Params: VideoParams; Reply: Result<Video> }>(
    "/videos/:videoId",
    {
      schema: {
        description: "Remove logicamente um vídeo.",
        tags: ["Videos"],
        params: videoParamsSchema,
        response: {
          200: resultSchema(videoSchema),
        },
      },
    },
    async (req, reply) => {
      await requireAdminSession(req);

      const video = await softDeleteVideo(req.params.videoId);
      if (!video) throw new NotFound("VIDEO_NOT_FOUND");

      return reply.send({ success: true, data: video, code: 200 });
    },
  );
}
