import type { NextFunction, Request, Response } from "express";
import { codeSubmissionSchema, questExerciseParamsSchema } from "@javaquets/validation";
import { ValidationError } from "../../common/errors/AppError.js";
import { getLearnerId } from "../../common/auth/learnerContext.js";
import { submitCode } from "./submission.service.js";

export async function submitCodeController(req: Request, res: Response, next: NextFunction) {
  try {
    const params = questExerciseParamsSchema.safeParse(req.params);
    const body = codeSubmissionSchema.safeParse(req.body);
    if (!params.success) throw new ValidationError("Invalid quest or exercise slug", params.error.flatten());
    if (!body.success) throw new ValidationError("Invalid code submission", body.error.flatten());
    res.status(201).json(await submitCode(getLearnerId(req), params.data.questSlug, params.data.exerciseSlug, body.data.sourceCode));
  } catch (error) { next(error); }
}
