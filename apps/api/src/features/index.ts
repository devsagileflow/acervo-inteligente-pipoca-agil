import { FastifyInstance } from "fastify";

import authRoute from "@/features/auth/auth.route";
import analyticsRoute from "@/features/analytics/analytics.route";
import healthRoute from "@/features/health/health.route";
import trailRoute from "@/features/trail/trail.route";
import videoRoute from "@/features/video/video.route";
import userRoute from "./user/user.route";

function apiRoutes(app: FastifyInstance) {
  app.register(authRoute);
  app.register(analyticsRoute);
  app.register(videoRoute);
  app.register(trailRoute);
  app.register(userRoute);
}

export default function routes(app: FastifyInstance) {
  app.register(healthRoute);
  app.register(apiRoutes, { prefix: "/api" });
}
