import { pinoHttp } from "pino-http";
import { randomUUID } from "node:crypto";
import { logger } from "./logger.js";

export const requestLogger = pinoHttp({
  logger,
  genReqId: (req) => req.headers["x-request-id"]?.toString() ?? randomUUID(),
  customProps: (req) => ({ requestId: req.id }),
  customSuccessMessage: (req, res) => `${req.method} ${req.url} ${res.statusCode}`,
  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
});
