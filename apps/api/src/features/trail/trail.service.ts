import {
  ContentType,
  Prisma,
  Trail as PrismaTrail,
  TrailItem as PrismaTrailItem,
  TrailItemProgress as PrismaTrailItemProgress,
  TrailProgress as PrismaTrailProgress,
  Video as PrismaVideo,
} from "@prisma/client";

import prisma from "@/lib/prisma";
import {
  CreateTrailBody,
  CreateTrailItemBody,
  ListTrailsQuery,
  MarkTrailItemViewedBody,
  PaginatedTrails,
  Trail,
  TrailItem,
  TrailItemProgress,
  TrailProgress,
  TrailProgressDetails,
  UpdateTrailBody,
  UpdateTrailItemBody,
  Video,
} from "@/packages/schemas";

const TEMP_POSITION_BASE = 1_000_000;

type TrailItemWithContent = PrismaTrailItem & {
  content?: PrismaVideo | null;
};

type TrailWithItems = PrismaTrail & {
  items?: TrailItemWithContent[];
};

const mapVideo = (video: PrismaVideo | null | undefined): Video | undefined =>
  video ? (video as Video) : undefined;

const mapTrailItem = (item: TrailItemWithContent): TrailItem => ({
  ...(item as TrailItem),
  content: mapVideo(item.content),
});

const mapTrail = (trail: TrailWithItems): Trail => ({
  ...(trail as Trail),
  items: trail.items?.map(mapTrailItem),
});

const mapTrailProgress = (progress: PrismaTrailProgress): TrailProgress =>
  progress as TrailProgress;

const mapTrailItemProgress = (
  progress: PrismaTrailItemProgress,
): TrailItemProgress => progress as TrailItemProgress;

const buildTrailWhere = (query: ListTrailsQuery, isAdmin: boolean) => {
  const includeDeleted = isAdmin && query.includeDeleted;

  return {
    deletedAt: includeDeleted ? undefined : null,
    isPublished: isAdmin ? query.isPublished : true,
    isActive: isAdmin ? query.isActive : true,
    title: query.title
      ? {
          contains: query.title,
          mode: "insensitive" as const,
        }
      : undefined,
  };
};

const getValidVideoReference = async (videoId: string) =>
  prisma.video.findFirst({
    where: {
      id: videoId,
      deletedAt: null,
    },
  });

const ensureContentReference = async (
  contentType: ContentType,
  contentId: string,
) => {
  if (contentType !== "VIDEO") return null;
  return getValidVideoReference(contentId);
};

const enrichTrailItems = async (
  items: PrismaTrailItem[],
  publicOnly: boolean,
): Promise<TrailItemWithContent[]> => {
  if (items.length === 0) return [];

  const videoIds = items
    .filter((item) => item.contentType === "VIDEO")
    .map((item) => item.contentId);

  const videos = await prisma.video.findMany({
    where: {
      id: { in: videoIds },
      deletedAt: null,
      isActive: publicOnly ? true : undefined,
    },
  });

  const videoMap = new Map(videos.map((video) => [video.id, video]));

  return items
    .map((item) => ({
      ...item,
      content:
        item.contentType === "VIDEO" ? videoMap.get(item.contentId) : null,
    }))
    .filter((item) => !publicOnly || Boolean(item.content));
};

const findTrailEntity = async (trailId: string, isAdmin: boolean) =>
  prisma.trail.findFirst({
    where: {
      id: trailId,
      deletedAt: isAdmin ? undefined : null,
      isActive: isAdmin ? undefined : true,
      isPublished: isAdmin ? undefined : true,
    },
  });

const reindexTrailItems = async (
  tx: Prisma.TransactionClient,
  trailId: string,
) => {
  const items = await tx.trailItem.findMany({
    where: {
      trailId,
      deletedAt: null,
    },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });

  for (const [index, item] of items.entries()) {
    await tx.trailItem.update({
      where: { id: item.id },
      data: { position: TEMP_POSITION_BASE + index + 1 },
    });
  }

  for (const [index, item] of items.entries()) {
    await tx.trailItem.update({
      where: { id: item.id },
      data: { position: index + 1 },
    });
  }
};

const normalizePosition = (position: number, maxPosition: number) =>
  Math.min(Math.max(position, 1), Math.max(maxPosition, 1));

const getOrderedTrailItems = async (trailId: string, publicOnly: boolean) => {
  const items = await prisma.trailItem.findMany({
    where: {
      trailId,
      deletedAt: null,
      isActive: publicOnly ? true : undefined,
    },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });

  return enrichTrailItems(items, publicOnly);
};

const recomputeTrailProgress = async (
  userId: string,
  trailId: string,
): Promise<TrailProgressDetails> => {
  const trail = await prisma.trail.findFirst({
    where: {
      id: trailId,
      deletedAt: null,
      isActive: true,
      isPublished: true,
    },
  });

  if (!trail) throw new Error("TRAIL_NOT_FOUND");

  const items = await getOrderedTrailItems(trailId, true);
  const eligibleItemIds = items.map((item) => item.id);
  const requiredItemIds = items
    .filter((item) => item.isRequired)
    .map((item) => item.id);

  const itemProgresses = eligibleItemIds.length
    ? await prisma.trailItemProgress.findMany({
        where: {
          userId,
          trailId,
          trailItemId: { in: eligibleItemIds },
        },
      })
    : [];

  const viewedItemIds = [
    ...new Set(
      itemProgresses.flatMap((item) =>
        item.trailItemId ? [item.trailItemId] : [],
      ),
    ),
  ];
  const viewedRequiredCount = requiredItemIds.filter((itemId) =>
    viewedItemIds.includes(itemId),
  ).length;
  const completionPercentage =
    eligibleItemIds.length === 0
      ? 0
      : Math.round((viewedItemIds.length / eligibleItemIds.length) * 100);
  const isCompleted =
    eligibleItemIds.length > 0 &&
    viewedRequiredCount === requiredItemIds.length;
  const completedAt = isCompleted ? new Date() : null;
  const lastViewedAt = itemProgresses.length
    ? itemProgresses.reduce(
        (latest, entry) => (entry.viewedAt > latest ? entry.viewedAt : latest),
        itemProgresses[0]!.viewedAt,
      )
    : null;

  const progress = await prisma.trailProgress.upsert({
    where: {
      userId_trailId: {
        userId,
        trailId,
      },
    },
    create: {
      userId,
      trailId,
      completionPercentage,
      isCompleted,
      completedAt,
      lastViewedAt,
    },
    update: {
      completionPercentage,
      isCompleted,
      completedAt,
      lastViewedAt,
    },
  });

  return {
    progress: mapTrailProgress(progress),
    viewedItemIds,
  };
};

export const createTrail = async (data: CreateTrailBody): Promise<Trail> => {
  const trail = await prisma.trail.create({
    data: {
      title: data.title,
      description: data.description,
      isPublished: data.isPublished ?? false,
      isActive: data.isActive ?? true,
    },
  });

  return mapTrail(trail);
};

export const listTrails = async (
  query: ListTrailsQuery,
  isAdmin: boolean,
): Promise<PaginatedTrails> => {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 10;
  const where = buildTrailWhere(query, isAdmin);

  const [trails, total] = await prisma.$transaction([
    prisma.trail.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.trail.count({ where }),
  ]);

  const itemsByTrail = query.includeItems
    ? await Promise.all(
        trails.map(async (trail) => ({
          trailId: trail.id,
          items: await getOrderedTrailItems(trail.id, !isAdmin),
        })),
      )
    : [];

  const itemsMap = new Map(
    itemsByTrail.map((entry) => [entry.trailId, entry.items]),
  );

  return {
    items: trails.map((trail) =>
      mapTrail({ ...trail, items: itemsMap.get(trail.id) }),
    ),
    page,
    pageSize,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / pageSize),
  };
};

export const getTrailById = async (
  trailId: string,
  isAdmin: boolean,
  includeItems = true,
): Promise<Trail | null> => {
  const trail = await findTrailEntity(trailId, isAdmin);
  if (!trail) return null;

  const items = includeItems
    ? await getOrderedTrailItems(trailId, !isAdmin)
    : undefined;
  return mapTrail({ ...trail, items });
};

export const updateTrail = async (
  trailId: string,
  data: UpdateTrailBody,
): Promise<Trail | null> => {
  const existingTrail = await prisma.trail.findFirst({
    where: { id: trailId, deletedAt: null },
  });
  if (!existingTrail) return null;

  const trail = await prisma.trail.update({
    where: { id: trailId },
    data: {
      title: data.title,
      description: data.description,
      isPublished: data.isPublished,
      isActive: data.isActive,
    },
  });

  return mapTrail(trail);
};

export const softDeleteTrail = async (
  trailId: string,
): Promise<Trail | null> => {
  const existingTrail = await prisma.trail.findFirst({
    where: { id: trailId, deletedAt: null },
  });
  if (!existingTrail) return null;

  const trail = await prisma.trail.update({
    where: { id: trailId },
    data: {
      isActive: false,
      isPublished: false,
      deletedAt: new Date(),
    },
  });

  return mapTrail(trail);
};

export const addTrailItem = async (
  trailId: string,
  data: CreateTrailItemBody,
): Promise<TrailItem | null> => {
  const trail = await prisma.trail.findFirst({
    where: { id: trailId, deletedAt: null },
  });
  if (!trail) return null;

  const content = await ensureContentReference(
    data.contentType,
    data.contentId,
  );
  if (!content) return null;

  return prisma.$transaction(async (tx) => {
    const activeItems = await tx.trailItem.findMany({
      where: { trailId, deletedAt: null },
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    });

    const normalizedPosition = normalizePosition(
      data.position,
      activeItems.length + 1,
    );
    const createdItem = await tx.trailItem.create({
      data: {
        trailId,
        contentType: data.contentType,
        contentId: data.contentId,
        position: TEMP_POSITION_BASE + activeItems.length + 1,
        isRequired: data.isRequired ?? true,
        isActive: data.isActive ?? true,
      },
    });

    const orderedIds = activeItems.map((item) => item.id);
    orderedIds.splice(normalizedPosition - 1, 0, createdItem.id);

    for (const [index, itemId] of orderedIds.entries()) {
      await tx.trailItem.update({
        where: { id: itemId },
        data: { position: TEMP_POSITION_BASE + index + 1 },
      });
    }

    for (const [index, itemId] of orderedIds.entries()) {
      await tx.trailItem.update({
        where: { id: itemId },
        data: { position: index + 1 },
      });
    }

    const item = await tx.trailItem.findUniqueOrThrow({
      where: { id: createdItem.id },
    });
    return mapTrailItem({ ...item, content: content as PrismaVideo });
  });
};

export const updateTrailItem = async (
  trailId: string,
  itemId: string,
  data: UpdateTrailItemBody,
): Promise<TrailItem | null> => {
  const existingItem = await prisma.trailItem.findFirst({
    where: {
      id: itemId,
      trailId,
      deletedAt: null,
    },
  });
  if (!existingItem) return null;

  const nextContentType = data.contentType ?? existingItem.contentType;
  const nextContentId = data.contentId ?? existingItem.contentId;
  const content = await ensureContentReference(nextContentType, nextContentId);
  if (!content) return null;

  return prisma.$transaction(async (tx) => {
    const siblings = await tx.trailItem.findMany({
      where: {
        trailId,
        deletedAt: null,
        id: { not: itemId },
      },
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
    });

    const normalizedPosition = normalizePosition(
      data.position ?? existingItem.position,
      siblings.length + 1,
    );

    await tx.trailItem.update({
      where: { id: itemId },
      data: {
        contentType: nextContentType,
        contentId: nextContentId,
        isRequired: data.isRequired,
        isActive: data.isActive,
        position: TEMP_POSITION_BASE,
      },
    });

    const orderedIds = siblings.map((item) => item.id);
    orderedIds.splice(normalizedPosition - 1, 0, itemId);

    for (const [index, currentItemId] of orderedIds.entries()) {
      await tx.trailItem.update({
        where: { id: currentItemId },
        data: { position: TEMP_POSITION_BASE + index + 1 },
      });
    }

    for (const [index, currentItemId] of orderedIds.entries()) {
      await tx.trailItem.update({
        where: { id: currentItemId },
        data: { position: index + 1 },
      });
    }

    const updatedItem = await tx.trailItem.findUniqueOrThrow({
      where: { id: itemId },
    });
    return mapTrailItem({ ...updatedItem, content: content as PrismaVideo });
  });
};

export const removeTrailItem = async (
  trailId: string,
  itemId: string,
): Promise<TrailItem | null> => {
  const existingItem = await prisma.trailItem.findFirst({
    where: { id: itemId, trailId, deletedAt: null },
  });
  if (!existingItem) return null;

  return prisma.$transaction(async (tx) => {
    const deletedItem = await tx.trailItem.update({
      where: { id: itemId },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });

    await reindexTrailItems(tx, trailId);
    return mapTrailItem({ ...deletedItem, content: undefined });
  });
};

export const markTrailItemViewed = async (
  userId: string,
  trailId: string,
  data: MarkTrailItemViewedBody,
): Promise<TrailProgressDetails | null> => {
  const trail = await prisma.trail.findFirst({
    where: {
      id: trailId,
      deletedAt: null,
      isActive: true,
      isPublished: true,
    },
  });
  if (!trail) return null;

  const item = await prisma.trailItem.findFirst({
    where: {
      id: data.trailItemId,
      trailId,
      deletedAt: null,
      isActive: true,
    },
  });
  if (!item) return null;

  const content = await ensureContentReference(
    item.contentType,
    item.contentId,
  );
  if (!content || !content.isActive) return null;

  await prisma.trailItemProgress.upsert({
    where: {
      userId_trailItemId: {
        userId,
        trailItemId: item.id,
      },
    },
    create: {
      userId,
      trailId,
      trailItemId: item.id,
      contentType: item.contentType,
      contentId: item.contentId,
      viewedAt: new Date(),
    },
    update: {
      trailId,
      contentType: item.contentType,
      contentId: item.contentId,
      viewedAt: new Date(),
    },
  });

  return recomputeTrailProgress(userId, trailId);
};

export const getTrailProgress = async (
  userId: string,
  trailId: string,
): Promise<TrailProgressDetails | null> => {
  const trail = await prisma.trail.findFirst({
    where: {
      id: trailId,
      deletedAt: null,
      isActive: true,
      isPublished: true,
    },
  });
  if (!trail) return null;

  return recomputeTrailProgress(userId, trailId);
};
