import { FastifyRequest } from "fastify";
import { Forbidden, Unauthorized } from "http-errors";

import prisma from "./prisma";

export const requireSessionUser = (request: FastifyRequest) => {
  const sessionUser = request.sessionUser;
  if (!sessionUser) throw new Unauthorized();

  return sessionUser;
};

export const isAdminSession = async (
  userId: string | null | undefined,
): Promise<boolean> => {
  if (!userId) return false;

  const user = await prisma.user.findUnique({
    select: { role: true },
    where: { id: userId },
  });

  return Boolean(user?.role.includes("ADMIN"));
};

export const requireAdminSession = async (request: FastifyRequest) => {
  const sessionUser = requireSessionUser(request);
  const isAdmin = await isAdminSession(sessionUser.user.id);

  if (!isAdmin) throw new Forbidden();

  return sessionUser;
};
