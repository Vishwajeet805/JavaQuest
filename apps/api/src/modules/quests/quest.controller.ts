import type { Request, Response, NextFunction } from "express";
import { slugParamsSchema } from "@javaquets/validation";
import { ValidationError } from "../../common/errors/AppError.js";
import { getPublishedQuest } from "./quest.service.js";

export async function getQuestController(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = slugParamsSchema.safeParse(req.params);
    if (!parsed.success) {
      throw new ValidationError("Invalid quest slug", parsed.error.flatten());
    }

    const quest = await getPublishedQuest(parsed.data.slug);
    res.json(quest);
  } catch (error) {
    next(error);
  }
}
