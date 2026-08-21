import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { prisma } from "@javaquets/database";
import { createApp } from "../../app.js";
import { hashSessionToken } from "../../common/auth/session.js";

const userId = "f2-integration-learner";
const courseSlug = "f2-progress-course";
const questSlug = "f2-progress-quest";
const exerciseSlug = "finish-me";

describe("Foundation 2 learner journey", () => {
  const app = createApp();
  const token = `test-session-${userId}`;
  const learner = { Cookie: `javaquets_session=${token}` };

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } });
    await prisma.course.deleteMany({ where: { slug: courseSlug } });
    await prisma.user.create({ data: { id: userId, email: "f2-test@javaquets.local" } });
    await prisma.authSession.create({ data: { userId, tokenHash: hashSessionToken(token), expiresAt: new Date(Date.now() + 60_000) } });
    await prisma.course.create({
      data: {
        slug: courseSlug, title: "F2 Course", description: "F2 fixture", status: "PUBLISHED",
        modules: { create: { slug: "module-one", title: "Module One", position: 1,
          quests: { create: { slug: questSlug, title: "F2 Quest", description: "Progress fixture", status: "PUBLISHED", position: 1,
            exercises: { create: { slug: exerciseSlug, title: "Finish Me", prompt: "Complete it", kind: "OUTPUT_PREDICTION", position: 1 } }
          } }
        } }
      }
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: userId } });
    await prisma.course.deleteMany({ where: { slug: courseSlug } });
  });

  it("rejects learner endpoints without identity", async () => {
    const response = await request(app).get("/me/enrollments");
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("AUTH_REQUIRED");
  });

  it("requires enrollment before quest progress", async () => {
    const response = await request(app).post(`/quests/${questSlug}/start`).set(learner);
    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("COURSE_ENROLLMENT_REQUIRED");
  });

  it("enrolls idempotently, starts a quest, completes an exercise and course", async () => {
    const first = await request(app).post(`/courses/${courseSlug}/enroll`).set(learner);
    expect(first.status).toBe(201);
    expect(first.body.status).toBe("ACTIVE");

    const second = await request(app).post(`/courses/${courseSlug}/enroll`).set(learner);
    expect(second.status).toBe(201);

    const started = await request(app).post(`/quests/${questSlug}/start`).set(learner);
    expect(started.status).toBe(200);
    expect(started.body.status).toBe("IN_PROGRESS");

    const completed = await request(app)
      .post(`/quests/${questSlug}/exercises/${exerciseSlug}/complete`)
      .set(learner);
    expect(completed.status).toBe(200);
    expect(completed.body.status).toBe("COMPLETED");
    expect(completed.body.completedExercises).toBe(1);

    const courseProgress = await request(app).get(`/me/courses/${courseSlug}/progress`).set(learner);
    expect(courseProgress.status).toBe(200);
    expect(courseProgress.body.percentComplete).toBe(100);
    expect(courseProgress.body.enrollmentStatus).toBe("COMPLETED");
  });
});
