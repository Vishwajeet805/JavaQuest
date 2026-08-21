import type { Request, Response, NextFunction } from "express";
import { slugParamsSchema } from "@javaquets/validation";
import { ValidationError } from "../../common/errors/AppError.js";
import { getPublishedCourse, listPublishedCourses } from "./course.service.js";

export async function listCoursesController(_req: Request, res: Response, next: NextFunction) {
  try {
    const courses = await listPublishedCourses();
    res.json({ items: courses });
  } catch (error) {
    next(error);
  }
}

export async function getCourseController(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = slugParamsSchema.safeParse(req.params);
    if (!parsed.success) {
      throw new ValidationError("Invalid course slug", parsed.error.flatten());
    }

    const course = await getPublishedCourse(parsed.data.slug);
    res.json(course);
  } catch (error) {
    next(error);
  }
}
