import { Waitlist as PrismaWaitlist } from "@prisma/client";

import prisma from "@/lib/prisma";
import {
  CreateWaitlistBody,
  ListWaitlistQuery,
  PaginatedWaitlist,
  Waitlist,
} from "@/packages/schemas";

const mapWaitlist = (waitlist: PrismaWaitlist): Waitlist => waitlist as Waitlist;

export const createWaitlistEntry = async (
  data: CreateWaitlistBody,
): Promise<{ waitlist: Waitlist; isNew: boolean }> => {
  const existing = await prisma.waitlist.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    return { waitlist: mapWaitlist(existing), isNew: false };
  }

  const waitlist = await prisma.waitlist.create({
    data: {
      name: data.name,
      email: data.email,
      role: data.role,
      message: data.message,
    },
  });

  return { waitlist: mapWaitlist(waitlist), isNew: true };
};

export const listWaitlistEntries = async (
  query: ListWaitlistQuery,
): Promise<PaginatedWaitlist> => {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 10;

  const [items, total] = await prisma.$transaction([
    prisma.waitlist.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.waitlist.count(),
  ]);

  return {
    items: items.map(mapWaitlist),
    page,
    pageSize,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / pageSize),
  };
};
