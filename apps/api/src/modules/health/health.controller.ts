import type { HealthResponse } from "@javaquets/shared";
import type { Request, Response } from "express";
import { checkDatabaseConnection, checkRunner } from "./health.service.js";

export async function healthHandler(_req: Request, res: Response) {
  const started=Date.now();const databaseConnected = await checkDatabaseConnection();const dbMs=Date.now()-started;
  const runnerStarted=Date.now();const runnerReady=await checkRunner();const runnerMs=Date.now()-runnerStarted;

  const body = {
    status: databaseConnected&&runnerReady ? "ok" : "degraded",
    service: "javaquets-api",
    database: databaseConnected ? "connected" : "disconnected",
    runner:runnerReady?"ready":"unavailable",
    checks:{database:dbMs,runner:runnerMs},
  } satisfies HealthResponse;

  res.setHeader("Cache-Control","no-store");res.status(databaseConnected&&runnerReady ? 200 : 503).json(body);
}
export function livenessHandler(_req:Request,res:Response){res.setHeader("Cache-Control","no-store");res.json({status:"ok",service:"javaquets-api",uptimeSeconds:Math.floor(process.uptime())})}
