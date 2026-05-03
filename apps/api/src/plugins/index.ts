import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

import corsPlugin from "./cors";
import sessionUser from "./session-user";
import { errorHandler } from "./error";
import rateLimit from "./rate-limit";
import swaggerPlugin from "./swagger";
import qsPlugin from "./qs";

export default fp(async (app: FastifyInstance) => {
  app.setErrorHandler(errorHandler);

  app.register(rateLimit);
  app.register(corsPlugin);
  app.register(sessionUser);
  app.register(swaggerPlugin);
  app.register(qsPlugin);
});
