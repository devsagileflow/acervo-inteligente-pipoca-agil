import { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import { AnalyticsEvent, AnalyticsEventBody } from "@/packages/schemas";

export const createAnalyticsEvent = async (
  data: AnalyticsEventBody,
  userId?: string,
): Promise<AnalyticsEvent> => {
  const event = await prisma.analyticsEvent.create({
    data: {
      eventName: data.eventName,
      pagePath: data.pagePath,
      anonymousId: data.anonymousId,
      targetId: data.targetId,
      referrer: data.referrer,
      properties: data.properties as Prisma.InputJsonValue | undefined,
      occurredAt: data.occurredAt ? new Date(data.occurredAt) : new Date(),
      userId,
    },
  });

  return event as AnalyticsEvent;
};

export const getClickSummary = async () => {
  const clicks = await prisma.$queryRaw<
    Array<{ targetId: string | null; clicks: bigint }>
  >`
    SELECT
      "targetId",
      COUNT(*)::bigint AS "clicks"
    FROM "analytics_event"
    WHERE "eventName" = 'click'
    GROUP BY "targetId"
    ORDER BY "clicks" DESC
  `;

  return clicks.map((entry) => ({
    targetId: entry.targetId,
    clicks: Number(entry.clicks),
  }));
};
