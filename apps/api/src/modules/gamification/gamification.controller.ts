import type { NextFunction, Request, Response } from "express";
import { getLearnerId } from "../../common/auth/learnerContext.js";
import { getGamification } from "./gamification.service.js";
export async function getGamificationController(req: Request, res: Response, next: NextFunction) { try { res.json(await getGamification(getLearnerId(req))); } catch (error) { next(error); } }
