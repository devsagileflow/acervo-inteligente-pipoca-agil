import { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import { AnalyticsEvent, AnalyticsEventBody } from "@/packages/schemas";

export const getAnalyticsEvents = async (): Promise<AnalyticsEvent[]> => {
  const events = await prisma.analyticsEvent.findMany();
  return events as AnalyticsEvent[];
};

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
