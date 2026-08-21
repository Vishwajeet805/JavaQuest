import express from "express";
import cors from "cors";
import { rootRouter } from "./routes/index.js";
import { requestLogger } from "./common/logging/requestLogger.js";
import { env } from "@javaquets/config";
import { errorHandler, notFoundHandler } from "./common/middleware/errorHandler.js";
import { csrfOriginGuard, securityHeaders } from "./common/security/securityHeaders.js";
import { rateLimit } from "./common/security/rateLimiter.js";
import { metricsMiddleware } from "./common/observability/metrics.js";
import { AppError } from "./common/errors/AppError.js";

export function createApp() {
  const app = express();
  if (env.TRUST_PROXY) app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use(securityHeaders);
  app.use(cors({ origin: (origin,callback)=>{if(!origin||origin===env.WEB_ORIGIN)return callback(null,true);callback(new AppError("CORS_ORIGIN_REJECTED","Request origin is not allowed",403));}, credentials: true, methods:["GET","POST","PUT","PATCH","DELETE","OPTIONS"], allowedHeaders:["content-type","x-request-id"] }));
  app.use(express.json({ limit: env.REQUEST_BODY_LIMIT, strict: true }));
  app.use(requestLogger);
  app.use((req,res,next)=>{res.setHeader("X-Request-Id",String(req.id));next()});
  app.use(metricsMiddleware);
  app.use(rateLimit("global",{windowMs:env.RATE_LIMIT_WINDOW_MS,max:env.RATE_LIMIT_MAX}));
  app.use(csrfOriginGuard);

  app.use(rootRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
