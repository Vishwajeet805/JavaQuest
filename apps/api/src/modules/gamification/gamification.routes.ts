import { Router } from "express";
import { requireLearner } from "../../common/auth/learnerContext.js";
import { getGamificationController } from "./gamification.controller.js";
export const gamificationRouter = Router();
gamificationRouter.get("/me/gamification", requireLearner, getGamificationController);
