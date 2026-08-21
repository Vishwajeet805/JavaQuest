import express from "express";
import cors from "cors";
import { rootRouter } from "./routes/index.js";
import { requestLogger } from "./common/logging/requestLogger.js";
import { errorHandler, notFoundHandler } from "./common/middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.use(rootRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
