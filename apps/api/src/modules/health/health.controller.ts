import type { HealthResponse } from "@javaquets/shared";
import type { Request, Response } from "express";
import { checkDatabaseConnection } from "./health.service.js";

export async function healthHandler(_req: Request, res: Response) {
  const databaseConnected = await checkDatabaseConnection();

  const body = {
    status: databaseConnected ? "ok" : "degraded",
    service: "javaquets-api",
    database: databaseConnected ? "connected" : "disconnected",
  } satisfies HealthResponse;

  res.status(databaseConnected ? 200 : 503).json(body);
}
