import { Router } from "express";
import { healthHandler, livenessHandler } from "./health.controller.js";

export const healthRouter = Router();

healthRouter.get("/", healthHandler);
healthRouter.get("/live", livenessHandler);
healthRouter.get("/ready", healthHandler);
