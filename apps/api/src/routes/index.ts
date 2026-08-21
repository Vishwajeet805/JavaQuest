import { Router } from "express";
import { healthRouter } from "../modules/health/health.routes.js";

export const rootRouter = Router();

rootRouter.use("/health", healthRouter);

// Future modules mount here, e.g.:
// rootRouter.use("/courses", coursesRouter);
// rootRouter.use("/quests", questsRouter);
