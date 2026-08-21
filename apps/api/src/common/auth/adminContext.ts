import type { NextFunction, Request, Response } from "express";
import { prisma } from "@javaquets/database";
import { AppError } from "../errors/AppError.js";
import { getLearnerId, requireLearner } from "./learnerContext.js";
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  requireLearner(req, res, async (error?: unknown) => {
    if (error) return next(error);
    try { const user=await prisma.user.findUnique({where:{id:getLearnerId(req)},select:{role:true}}); if(user?.role!=="ADMIN")throw new AppError("ADMIN_REQUIRED","Administrator access is required",403); next(); } catch (cause) { next(cause); }
  });
}
