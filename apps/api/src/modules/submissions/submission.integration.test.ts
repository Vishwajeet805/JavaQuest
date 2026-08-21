import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { prisma } from "@javaquets/database";
import { createApp } from "../../app.js";
import { hashSessionToken } from "../../common/auth/session.js";

const userId = "f3-security-learner";
const courseSlug = "f3-security-course";
const questSlug = "f3-security-quest";
const exerciseSlug = "code-only-through-runner";

describe("Foundation 3 submission boundary", () => {
  const app = createApp();
  const token = `test-session-${userId}`;
  const learner = { Cookie: `javaquets_session=${token}` };
  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } });
    await prisma.course.deleteMany({ where: { slug: courseSlug } });
    await prisma.user.create({ data: { id: userId, email: "f3-test@javaquets.local" } });
    await prisma.authSession.create({ data: { userId, tokenHash: hashSessionToken(token), expiresAt: new Date(Date.now() + 60_000) } });
    await prisma.course.create({ data: { slug: courseSlug, title: "F3", description: "fixture", status: "PUBLISHED", modules: { create: { slug: "m", title: "M", position: 1, quests: { create: { slug: questSlug, title: "Q", description: "fixture", status: "PUBLISHED", position: 1, exercises: { create: { slug: exerciseSlug, title: "Code", prompt: "print ok", kind: "CODE", position: 1, testCases: { create: { position: 1, expectedOutput: "ok", isHidden: true } } } } } } } } } });
    await request(app).post(`/courses/${courseSlug}/enroll`).set(learner);
  });
  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } });
    await prisma.course.deleteMany({ where: { slug: courseSlug } });
  });
  it("does not allow a CODE exercise to bypass evaluation", async () => {
    const response = await request(app).post(`/quests/${questSlug}/exercises/${exerciseSlug}/complete`).set(learner);
    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("CODE_EVALUATION_REQUIRED");
  });
  it("validates submission source", async () => {
    const response = await request(app).post(`/quests/${questSlug}/exercises/${exerciseSlug}/submissions`).set(learner).send({ sourceCode: "" });
    expect(response.status).toBe(400);
  });
});
