import { Router } from "express";
import { requireLearner } from "../../common/auth/learnerContext.js";
import { submitCodeController } from "./submission.controller.js";
import { env } from "@javaquets/config";
import { rateLimit } from "../../common/security/rateLimiter.js";
export const submissionRouter = Router();
submissionRouter.post("/quests/:questSlug/exercises/:exerciseSlug/submissions", requireLearner, rateLimit("submissions",{windowMs:env.RATE_LIMIT_WINDOW_MS,max:env.SUBMISSION_RATE_LIMIT_MAX,key:"user"}), submitCodeController);
