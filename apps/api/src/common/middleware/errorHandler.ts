import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/index.js";
import { logger } from "../logging/logger.js";
import { increment } from "../observability/metrics.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  void _next;
  const requestId=String((_req as Request & {id?:string}).id??"unknown");
  if (err && typeof err === "object" && "type" in err && err.type === "entity.too.large") {
    increment("javaquets_http_errors_total",{code:"PAYLOAD_TOO_LARGE"});
    res.status(413).json({error:{code:"PAYLOAD_TOO_LARGE",message:"Request body is too large",details:null,requestId}});return;
  }
  if (err && typeof err === "object" && "name" in err && err.name === "ZodError") {
    increment("javaquets_http_errors_total",{code:"VALIDATION_ERROR"});
    res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Request data is invalid", details: "flatten" in err && typeof err.flatten === "function" ? err.flatten() : null, requestId } });
    return;
  }
  if (err instanceof AppError) {
    increment("javaquets_http_errors_total",{code:err.code});
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details ?? null,
        requestId,
      },
    });
    return;
  }

  increment("javaquets_http_errors_total",{code:"INTERNAL_SERVER_ERROR"});
  logger.error({ err,requestId }, "Unhandled error");

  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
      details: null,
      requestId,
    },
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: {
      code: "ROUTE_NOT_FOUND",
      message: `No route for ${req.method} ${req.path}`,
      details: null,
    },
  });
}
