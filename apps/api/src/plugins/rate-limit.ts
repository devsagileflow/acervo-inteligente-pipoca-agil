import RateLimit from "@fastify/rate-limit";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

import { env } from "@/config";

export default fp(async (app: FastifyInstance) => {
  app.register(RateLimit, {
    max: env.MAX_REQUESTS_PER_MINUTE,
    timeWindow: "1 minute",
    keyGenerator: (req) => req.ip,
    errorResponseBuilder: (_, context) => ({
      statusCode: 429,
      error: "Too Many Requests",
      message: `You have exceeded the ${context.max} requests in ${context.after}. Please try again later.`,
      type: "https://datatracker.ietf.org/doc/html/rfc6585#section-4",
    }),
  });
});
