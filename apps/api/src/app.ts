import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

import { logger } from "@/config";
import routes from "@/features";
import plugins from "@/plugins";

const app = fastify({
  loggerInstance: logger,
  requestIdHeader: "X-Request-ID",
  genReqId: () => crypto.randomUUID(),
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(plugins);
app.register(routes);

export default app;
