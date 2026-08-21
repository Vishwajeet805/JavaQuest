import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../app.js";
import express from "express";
import { rateLimit, resetRateLimitersForTests } from "./rateLimiter.js";
import { errorHandler } from "../middleware/errorHandler.js";
const app=createApp();
describe("production HTTP security boundary",()=>{
  it("sets secure headers and a traceable request id",async()=>{const response=await request(app).get("/health/live").set("X-Request-Id","security-test-id");expect(response.status).toBe(200);expect(response.headers["x-request-id"]).toBe("security-test-id");expect(response.headers["x-content-type-options"]).toBe("nosniff");expect(response.headers["x-frame-options"]).toBe("DENY");expect(response.headers["x-powered-by"]).toBeUndefined()});
  it("rejects cross-origin unsafe requests",async()=>{const response=await request(app).post("/auth/login").set("Origin","https://attacker.invalid").send({email:"x@example.com",password:"password123"});expect(response.status).toBe(403);expect(response.body.error.code).toBe("CORS_ORIGIN_REJECTED")});
  it("rejects oversized JSON without echoing its contents",async()=>{const marker="secret-marker";const response=await request(app).post("/auth/login").send({email:"x@example.com",password:marker.repeat(30000)});expect(response.status).toBe(413);expect(JSON.stringify(response.body)).not.toContain(marker)});
  it("rate limits repeated unauthenticated abuse",async()=>{resetRateLimitersForTests();const limited=express();limited.use(rateLimit("security-test",{windowMs:60000,max:2}));limited.get("/",(_req,res)=>res.json({ok:true}));limited.use(errorHandler);expect((await request(limited).get("/")).status).toBe(200);expect((await request(limited).get("/")).status).toBe(200);const blocked=await request(limited).get("/");expect(blocked.status).toBe(429);expect(blocked.headers["retry-after"]).toBeDefined()});
});
