import dotenv from "dotenv";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  DEBUG: z
    .string()
    .optional()
    .transform((val) => val?.trim().toLowerCase() === "true"),
  LOG: z
    .string()
    .optional()
    .transform((val) => val?.trim().toLowerCase() === "true"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),

  APP_NAME: z.string(),
  PORT: z.string().transform((val) => parseInt(val)),
  HOST: z.string(),
  BASE_URL: z.url(),
  MAX_REQUESTS_PER_MINUTE: z.string().transform((val) => parseInt(val)),
  ALLOWED_ORIGINS: z.string().transform((val) => val.split(",")),

  DATABASE_URL: z.string(),

  AUTH_SECRET: z.string(),
});

// Load .env for local development while keeping hosted environments (Render)
// fully based on process.env.
dotenv.config();

const env = envSchema.parse(process.env);

export { env };
