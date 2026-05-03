import type { FastifyInstance } from "fastify";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import { isHttpError } from "http-errors";

import { env, logger } from "@/config";
import { Prisma } from "@prisma/client";

export const errorHandler: FastifyInstance["errorHandler"] = (
  error,
  _,
  reply,
) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    logger.warn("Validation error: %o", error);
    return reply.status(400).send({
      success: false,
      message: "VALIDATION_ERROR",
      code: 400,
      error: {
        errors: error.validation.map((e) => e.message),
        properties: error.validation,
      },
    });
  }

  if (isHttpError(error)) {
    logger.warn("HTTP error: %o", error);
    return reply.status(error.statusCode).send({
      success: false,
      message: error.message,
      code: error.statusCode,
      error: { errors: [error.message] },
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error(
      `Prisma error: ${error.code} - ${error.message} - ${error.stack}`,
    );

    if (error.code === "P2002")
      return reply.status(409).send({
        success: false,
        message: "DUPLICATE_ENTRY",
        error: { errors: ["UNIQUE_CONSTRAINT_FAILED"] },
        code: 409,
      });

    return reply.status(500).send({
      success: false,
      message:
        "DATABASE_ERROR" +
        (env.NODE_ENV === "development"
          ? ` Error details: ${error.code} - ${error.message}`
          : ""),
      code: 500,
    });
  }

  logger.error(error instanceof Error ? error.stack : (error as string));
  return reply.status(500).send({
    success: false,
    message:
      "INTERNAL_SERVER_ERROR" +
      (env.NODE_ENV === "development"
        ? ` Error details: ${error instanceof Error ? error.message : error}`
        : ""),
    code: 500,
  });
};
