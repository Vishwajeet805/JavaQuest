import { Router } from "express";
import { requireLearner } from "../../common/auth/learnerContext.js";
import { enrollController, listEnrollmentsController } from "./enrollment.controller.js";

export const enrollmentRouter = Router();
enrollmentRouter.post("/courses/:slug/enroll", requireLearner, enrollController);
enrollmentRouter.get("/me/enrollments", requireLearner, listEnrollmentsController);
