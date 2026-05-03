import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

import { auth } from "@/lib";

const toHeaders = (
  headersObject: Record<string, string | string[] | undefined>,
): Headers => {
  const headers = new Headers();

  Object.entries(headersObject).forEach(([key, value]) => {
    if (!value) return;

    if (Array.isArray(value)) {
      value.forEach((item) => headers.append(key, item));
      return;
    }

    headers.append(key, value);
  });

  return headers;
};

export default fp(async (app: FastifyInstance) => {
  app.decorateRequest("sessionUser", null);

  app.addHook("preHandler", async (req) => {
    const headers = toHeaders(req.headers);
    const session = await auth.api.getSession({ headers });
    req.sessionUser = session;
  });
});
