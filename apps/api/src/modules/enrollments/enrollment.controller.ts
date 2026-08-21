import type { NextFunction, Request, Response } from "express";
import { slugParamsSchema } from "@javaquets/validation";
import { ValidationError } from "../../common/errors/AppError.js";
import { getLearnerId } from "../../common/auth/learnerContext.js";
import { enrollInCourse, listEnrollments } from "./enrollment.service.js";

export async function enrollController(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = slugParamsSchema.safeParse(req.params);
    if (!parsed.success) throw new ValidationError("Invalid course slug", parsed.error.flatten());
    const enrollment = await enrollInCourse(getLearnerId(req), parsed.data.slug);
    res.status(201).json(enrollment);
  } catch (error) { next(error); }
}

export async function listEnrollmentsController(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({ items: await listEnrollments(getLearnerId(req)) });
  } catch (error) { next(error); }
}
