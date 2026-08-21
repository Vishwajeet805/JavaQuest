import { Router } from "express";
import { requireLearner } from "../../common/auth/learnerContext.js";
import { completeExerciseController, getCourseProgressController, getQuestProgressController, startQuestController } from "./progress.controller.js";

export const progressRouter = Router();
progressRouter.post("/quests/:slug/start", requireLearner, startQuestController);
progressRouter.post("/quests/:questSlug/exercises/:exerciseSlug/complete", requireLearner, completeExerciseController);
progressRouter.get("/me/quests/:slug/progress", requireLearner, getQuestProgressController);
progressRouter.get("/me/courses/:slug/progress", requireLearner, getCourseProgressController);
