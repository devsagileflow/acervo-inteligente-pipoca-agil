import fastifyCors from "@fastify/cors";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

export default fp(async (app: FastifyInstance) => {
  app.register(fastifyCors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    maxAge: 86400, // 24 hours
  });
});
