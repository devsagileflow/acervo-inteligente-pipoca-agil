import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import qs from "qs";

/**
 * Normaliza os parâmetros de consulta convertendo as representações string de booleanos e null para seus tipos reais.
 *
 * @param query - Um objeto contendo os parâmetros de consulta a serem normalizados
 * @returns O objeto de consulta normalizado com as strings "true", "false" e "null" convertidas para seus respectivos tipos
 *
 * @example
 * ```typescript
 * const query = { active: "true", deleted: "false", reference: "null", nested: { flag: "true" } };
 * const normalized = normalizeQueryParams(query);
 * // Result: { active: true, deleted: false, reference: null, nested: { flag: true } }
 * ```
 */
function normalizeQueryParams(query: Record<string, any>): Record<string, any> {
  for (const key in query) {
    if (query[key] === "true") query[key] = true;
    else if (query[key] === "false") query[key] = false;
    else if (query[key] === "null") query[key] = null;
    else if (Object.prototype.toString.call(query[key]) === "[object Object]")
      query[key] = normalizeQueryParams(query[key]);
  }
  return query;
}

export default fp(async (app: FastifyInstance) => {
  app.decorate("qs", qs);

  app.addHook("onRequest", async (req) => {
    const queryString = req.url.split("?")[1];
    req.query = qs.parse(queryString || "");
    req.query = normalizeQueryParams(req.query as Record<string, any>);
  });
});
