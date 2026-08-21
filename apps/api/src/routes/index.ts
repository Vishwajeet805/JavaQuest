import { Router } from "express";
import { healthRouter } from "../modules/health/health.routes.js";
import { coursesRouter } from "../modules/courses/course.routes.js";
import { questsRouter } from "../modules/quests/quest.routes.js";

export const rootRouter = Router();

rootRouter.use("/health", healthRouter);
rootRouter.use("/courses", coursesRouter);
rootRouter.use("/quests", questsRouter);
