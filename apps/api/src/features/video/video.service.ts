import { Video as PrismaVideo } from "@prisma/client";

import prisma from "@/lib/prisma";
import {
  CreateVideoBody,
  ListVideosQuery,
  PaginatedVideos,
  UpdateVideoBody,
  Video,
} from "@/packages/schemas";

const mapVideo = (video: PrismaVideo): Video => video as Video;

const buildVideoWhere = (query: ListVideosQuery, isAdmin: boolean) => {
  const includeDeleted = isAdmin && query.includeDeleted;

  return {
    deletedAt: includeDeleted ? undefined : null,
    isActive: isAdmin ? query.isActive : true,
    title: query.title
      ? {
          contains: query.title,
          mode: "insensitive" as const,
        }
      : undefined,
  };
};

export const createVideo = async (data: CreateVideoBody): Promise<Video> => {
  const video = await prisma.video.create({
    data: {
      title: data.title,
      description: data.description,
      youtubeUrl: data.youtubeUrl,
      durationInSeconds: data.durationInSeconds,
      isActive: data.isActive ?? true,
    },
  });

  return mapVideo(video);
};

export const listVideos = async (
  query: ListVideosQuery,
  isAdmin: boolean,
): Promise<PaginatedVideos> => {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 10;
  const where = buildVideoWhere(query, isAdmin);

  const [items, total] = await prisma.$transaction([
    prisma.video.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.video.count({ where }),
  ]);

  return {
    items: items.map(mapVideo),
    page,
    pageSize,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / pageSize),
  };
};

export const getVideoById = async (
  videoId: string,
  isAdmin: boolean,
): Promise<Video | null> => {
  const video = await prisma.video.findFirst({
    where: {
      id: videoId,
      deletedAt: isAdmin ? undefined : null,
      isActive: isAdmin ? undefined : true,
    },
  });

  return video ? mapVideo(video) : null;
};

export const getVideoEntityById = async (videoId: string) =>
  prisma.video.findFirst({
    where: {
      id: videoId,
      deletedAt: null,
    },
  });

export const updateVideo = async (
  videoId: string,
  data: UpdateVideoBody,
): Promise<Video | null> => {
  const existingVideo = await getVideoEntityById(videoId);
  if (!existingVideo) return null;

  const video = await prisma.video.update({
    where: { id: videoId },
    data: {
      title: data.title,
      description: data.description,
      youtubeUrl: data.youtubeUrl,
      durationInSeconds: data.durationInSeconds,
      isActive: data.isActive,
    },
  });

  return mapVideo(video);
};

export const softDeleteVideo = async (
  videoId: string,
): Promise<Video | null> => {
  const existingVideo = await getVideoEntityById(videoId);
  if (!existingVideo) return null;

  const video = await prisma.video.update({
    where: { id: videoId },
    data: {
      isActive: false,
      deletedAt: new Date(),
    },
  });

  return mapVideo(video);
};
