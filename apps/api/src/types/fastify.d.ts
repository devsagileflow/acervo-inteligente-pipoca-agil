import "fastify";

import type { auth } from "@/lib";

type SessionUser = typeof auth.$Infer.Session | null;

declare module "fastify" {
  interface FastifyRequest {
    sessionUser: SessionUser;
  }
}
