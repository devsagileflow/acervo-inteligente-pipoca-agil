import pino from "pino";

import { env } from "./env";

export const logger = pino({
  level: env.LOG_LEVEL,
  enabled: env.LOG,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "yyyy-mm-dd HH:MM:ss.l o",
    },
  },
});

export const loggerAdapter = {
  disabled: !env.LOG,
  log: (level: string, message: string, ...args: unknown[]) => {
    switch (level) {
      case "debug":
        logger.debug(args, message);
        break;
      case "info":
        logger.info(args, message);
        break;
      case "warn":
        logger.warn(args, message);
        break;
      case "error":
        logger.error(args, message);
        break;
    }
  },
};
