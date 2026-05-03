import { FastifyInstance } from "fastify";

import authRoute from "@/features/auth/auth.route";
import healthRoute from "@/features/health/health.route";
import userRoute from "./user/user.route";

function apiRoutes(app: FastifyInstance) {
  app.register(authRoute);
  app.register(userRoute);
}

export default function routes(app: FastifyInstance) {
  app.register(healthRoute);
  app.register(apiRoutes, { prefix: "/api" });
}
