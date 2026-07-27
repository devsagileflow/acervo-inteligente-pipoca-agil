import {
  ContentType,
  Trail as PrismaTrail,
  TrailItem as PrismaTrailItem,
  TrailItemProgress as PrismaTrailItemProgress,
  TrailProgress as PrismaTrailProgress,
  Video as PrismaVideo,
} from "@prisma/client";

import prisma from "@/lib/prisma";
import {
  Trail,
  TrailItem,
  Video,
  TrailProgress,
  TrailItemProgress,
} from "@/packages/schemas";

export type TrailItemWithContent = PrismaTrailItem & {
  content?: PrismaVideo | null;
};

export type TrailWithItems = PrismaTrail & {
  items?: TrailItemWithContent[];
};

export const mapVideo = (
  video: PrismaVideo | null | undefined,
): Video | undefined => (video ? (video as Video) : undefined);

export const mapTrailItem = (item: TrailItemWithContent): TrailItem => ({
  ...(item as TrailItem),
  content: mapVideo(item.content),
});

export const mapTrail = (trail: TrailWithItems): Trail => ({
  ...(trail as Trail),
  items: trail.items?.map(mapTrailItem),
});

export const mapTrailProgress = (
  progress: PrismaTrailProgress,
): TrailProgress => progress as TrailProgress;

export const mapTrailItemProgress = (
  progress: PrismaTrailItemProgress,
): TrailItemProgress => progress as TrailItemProgress;

export const getValidVideoReference = async (
  videoId: string,
): Promise<PrismaVideo | null> =>
  prisma.video.findFirst({
    where: {
      id: videoId,
      deletedAt: null,
    },
  });

/**
 * Garante que o conteúdo referenciado por um item de trilha exista e seja válido.
 *
 * Atualmente apenas conteúdos do tipo `VIDEO` são suportados; para outros tipos
 * a função retorna `null` imediatamente.
 *
 * @param contentType - Tipo do conteúdo referenciado (ex.: `VIDEO`).
 * @param contentId - Identificador do conteúdo a ser validado.
 * @returns O registro do vídeo válido, ou `null` se o tipo não for suportado
 *          ou se o vídeo não for encontrado/excluído.
 */
export const ensureContentReference = async (
  contentType: ContentType,
  contentId: string,
): Promise<PrismaVideo | null> => {
  if (contentType !== "VIDEO") return null;
  return getValidVideoReference(contentId);
};
