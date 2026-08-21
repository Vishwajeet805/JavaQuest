import { Router } from "express";
import { getQuestController } from "./quest.controller.js";

export const questsRouter = Router();

questsRouter.get("/:slug", getQuestController);
