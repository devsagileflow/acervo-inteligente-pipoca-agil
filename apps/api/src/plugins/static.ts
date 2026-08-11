import fastifyStatic from "@fastify/static";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import path from "path";

export default fp(async (app: FastifyInstance) => {
  app.register(fastifyStatic, {
    root: path.join(__dirname, "..", "..", "public"),
    prefix: "/public/",
  });
});
