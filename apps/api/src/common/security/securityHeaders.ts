import type { NextFunction, Request, Response } from "express";
import { env } from "@javaquets/config";
import { AppError } from "../errors/AppError.js";

const unsafeMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);
export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  if (env.NODE_ENV === "production") res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  if (_req.path.startsWith("/auth") || _req.path.startsWith("/me") || _req.path.startsWith("/admin")) res.setHeader("Cache-Control", "no-store");
  next();
}
export function csrfOriginGuard(req: Request, _res: Response, next: NextFunction) {
  if (!unsafeMethods.has(req.method)) return next();
  const origin = req.header("origin");
  if (origin && origin !== env.WEB_ORIGIN) return next(new AppError("CSRF_ORIGIN_REJECTED", "Request origin is not allowed", 403));
  if (!origin && env.NODE_ENV === "production") return next(new AppError("CSRF_ORIGIN_REQUIRED", "Request origin is required", 403));
  next();
}
