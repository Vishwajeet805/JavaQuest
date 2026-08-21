import pino from "pino";
import { env } from "@javaquets/config";

export const logger = pino({
  level: env.NODE_ENV === "development" ? "debug" : "info",
  base: { service: "javaquets-api", environment: env.NODE_ENV },
  redact: { paths: ["req.headers.authorization", "req.headers.cookie", "res.headers.set-cookie", "password", "passwordHash", "token", "session", "sourceCode", "solution", "expectedOutput", "DATABASE_URL", "METRICS_TOKEN"], censor: "[REDACTED]" },
  transport:
    env.NODE_ENV === "development"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
});
