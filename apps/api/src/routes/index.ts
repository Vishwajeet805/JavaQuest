import { Router } from "express";
import { healthRouter } from "../modules/health/health.routes.js";
import { coursesRouter } from "../modules/courses/course.routes.js";
import { questsRouter } from "../modules/quests/quest.routes.js";
import { enrollmentRouter } from "../modules/enrollments/enrollment.routes.js";
import { progressRouter } from "../modules/progress/progress.routes.js";
import { submissionRouter } from "../modules/submissions/submission.routes.js";
import { authRouter } from "../modules/auth/auth.routes.js";
import { gamificationRouter } from "../modules/gamification/gamification.routes.js";
import { adminRouter } from "../modules/admin/admin.routes.js";
import { metricsRouter } from "../modules/metrics/metrics.routes.js";

export const rootRouter = Router();

rootRouter.use("/health", healthRouter);
rootRouter.use(authRouter);
rootRouter.use("/courses", coursesRouter);
rootRouter.use("/quests", questsRouter);

rootRouter.use(enrollmentRouter);
rootRouter.use(progressRouter);
rootRouter.use(submissionRouter);
rootRouter.use(gamificationRouter);
rootRouter.use(adminRouter);
rootRouter.use(metricsRouter);
