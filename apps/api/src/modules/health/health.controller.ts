import type { Request, Response } from "express";
import { checkDatabaseConnection } from "./health.service.js";

export async function healthHandler(_req: Request, res: Response) {
  const database = await checkDatabaseConnection();

  res.status(200).json({
    status: "ok",
    service: "javaquets-api",
    database: database ? "connected" : "disconnected",
  });
}
