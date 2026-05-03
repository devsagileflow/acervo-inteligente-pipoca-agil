import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { jsonSchemaTransform } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { OpenAPIV3 } from "openapi-types";
import ScalarApiRef from "@scalar/fastify-api-reference";

import { env } from "@/config";

const openapi: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "My API",
    description: "API documentation",
    version: "1.0.0",
    contact: {
      name: "API Support",
      email: "support@example.com",
      url: "https://example.com/support",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
    termsOfService: `${env.BASE_URL}/terms`,
  },
  externalDocs: {
    description: "Authentication API Reference",
    url: `${env.BASE_URL}/api/auth/reference`,
  },
  paths: {},
};

export default fp(async (app: FastifyInstance) => {
  if (env.NODE_ENV === "development") {
    app.register(fastifySwagger, {
      openapi: openapi,
      transform: jsonSchemaTransform,
    });

    app.register(ScalarApiRef, {
      routePrefix: "/reference",
    });

    console.log(`📝 Scalar UI available at ${env.BASE_URL}/reference`);

    app.register(swaggerUI, {
      routePrefix: "/docs",
    });

    console.log(`📝 Swagger UI available at ${env.BASE_URL}/docs`);
  }
});
