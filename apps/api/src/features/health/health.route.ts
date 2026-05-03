import { FastifyInstance } from "fastify";

import prisma from "@/lib/prisma";

export default function healthRoute(app: FastifyInstance) {
  app.get(
    "/health",
    {
      schema: {
        description: "Health check endpoint",
        tags: ["Health"],
      },
    },
    async () => {
      const now = new Date();
      await prisma.$queryRaw`SELECT 1`;
      return { status: "ok", timestamp: now.toISOString() };
    },
  );
}
