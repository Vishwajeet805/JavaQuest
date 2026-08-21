import { Router } from "express";
import { getCourseController, listCoursesController } from "./course.controller.js";

export const coursesRouter = Router();

coursesRouter.get("/", listCoursesController);
coursesRouter.get("/:slug", getCourseController);
