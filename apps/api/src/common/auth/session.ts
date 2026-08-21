import { createHash, randomBytes } from "node:crypto";
import { env } from "@javaquets/config";
export const SESSION_COOKIE = env.NODE_ENV === "production" ? "__Host-javaquets_session" : "javaquets_session";
export function newSessionToken() { return randomBytes(32).toString("base64url"); }
export function hashSessionToken(token: string) { return createHash("sha256").update(token).digest("hex"); }
export function readCookie(header: string | undefined, name: string) {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
}
