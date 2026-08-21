import type { NextFunction, Request, Response } from "express";
import { prisma } from "@javaquets/database";
import { AppError } from "../errors/AppError.js";
import { SESSION_COOKIE, hashSessionToken, readCookie } from "./session.js";
import { env } from "@javaquets/config";
import { increment } from "../observability/metrics.js";

type RequestWithLearner = Request & { learnerId?: string };

export async function requireLearner(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = readCookie(req.header("cookie"), SESSION_COOKIE);
    if (!token) throw new AppError("AUTH_REQUIRED", "Authentication is required", 401);
    const session = await prisma.authSession.findUnique({
      where: { tokenHash: hashSessionToken(token) },
      select: { id: true, userId: true, expiresAt: true, lastSeenAt: true, revokedAt: true },
    });
    const now=new Date();
    const idleBefore=new Date(now.getTime()-env.SESSION_IDLE_HOURS*3_600_000);
    if (!session || session.revokedAt || session.expiresAt <= now || session.lastSeenAt < idleBefore) {
      increment("javaquets_auth_failures_total",{reason:"invalid_session"});
      throw new AppError("AUTH_REQUIRED", "Session is missing or expired", 401);
    }
    if(now.getTime()-session.lastSeenAt.getTime()>300_000)void prisma.authSession.update({where:{id:session.id},data:{lastSeenAt:now}}).catch(()=>undefined);
    (req as RequestWithLearner).learnerId = session.userId;
    next();
  } catch (error) { next(error); }
}

export function getLearnerId(req: Request): string {
  const learnerId = (req as RequestWithLearner).learnerId;
  if (!learnerId) throw new AppError("AUTH_REQUIRED", "Authentication is required", 401);
  return learnerId;
}
