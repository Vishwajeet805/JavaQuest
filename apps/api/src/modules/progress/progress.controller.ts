import type { NextFunction, Request, Response } from "express";
import { questExerciseParamsSchema, slugParamsSchema } from "@javaquets/validation";
import { ValidationError } from "../../common/errors/AppError.js";
import { getLearnerId } from "../../common/auth/learnerContext.js";
import { completeExercise, getCourseProgress, getQuestProgress, startQuest } from "./progress.service.js";

function slug(req: Request) {
  const parsed = slugParamsSchema.safeParse(req.params);
  if (!parsed.success) throw new ValidationError("Invalid slug", parsed.error.flatten());
  return parsed.data.slug;
}
export async function startQuestController(req: Request, res: Response, next: NextFunction) { try { res.json(await startQuest(getLearnerId(req), slug(req))); } catch (e) { next(e); } }
export async function completeExerciseController(req: Request, res: Response, next: NextFunction) { try { const parsed = questExerciseParamsSchema.safeParse(req.params); if (!parsed.success) throw new ValidationError("Invalid quest or exercise slug", parsed.error.flatten()); res.json(await completeExercise(getLearnerId(req), parsed.data.questSlug, parsed.data.exerciseSlug)); } catch (e) { next(e); } }
export async function getQuestProgressController(req: Request, res: Response, next: NextFunction) { try { res.json(await getQuestProgress(getLearnerId(req), slug(req))); } catch (e) { next(e); } }
export async function getCourseProgressController(req: Request, res: Response, next: NextFunction) { try { res.json(await getCourseProgress(getLearnerId(req), slug(req))); } catch (e) { next(e); } }
