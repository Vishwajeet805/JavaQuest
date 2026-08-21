import { beforeAll, afterAll, describe, expect, it } from "vitest";
import request from "supertest";
import { prisma } from "@javaquets/database";
import { createApp } from "../../app.js";
const app=createApp(); const email="f4-test@javaquets.local";
beforeAll(async()=>{await prisma.user.deleteMany({where:{email}})});
afterAll(async()=>{await prisma.user.deleteMany({where:{email}});await prisma.$disconnect()});
describe("auth",()=>{
 it("signs up, authenticates via HttpOnly session cookie, and logs out",async()=>{
  const signup=await request(app).post("/auth/signup").send({email,password:"strong-pass-123",displayName:"F4 Learner"});
  expect(signup.status).toBe(201); expect(signup.headers["set-cookie"]?.[0]).toContain("HttpOnly");
  const cookie=signup.headers["set-cookie"]?.[0]?.split(";")[0];
  const me=await request(app).get("/auth/me").set("Cookie",cookie!); expect(me.status).toBe(200); expect(me.body.user.email).toBe(email);
  const logout=await request(app).post("/auth/logout").set("Cookie",cookie!); expect(logout.status).toBe(204);
  const after=await request(app).get("/auth/me").set("Cookie",cookie!); expect(after.status).toBe(401);
 });
});
