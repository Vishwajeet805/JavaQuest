import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { prisma } from "@javaquets/database";
import { createApp } from "../../app.js";

const courseSlug = "integration-java-course";
const questSlug = "integration-java-quest";

describe("learning discovery API", () => {
  const app = createApp();

  beforeAll(async () => {
    await prisma.course.deleteMany({ where: { slug: courseSlug } });
    await prisma.course.create({
      data: {
        slug: courseSlug,
        title: "Integration Java Course",
        description: "API integration fixture",
        status: "PUBLISHED",
        difficulty: "BEGINNER",
        modules: {
          create: {
            slug: "integration-module",
            title: "Integration Module",
            position: 1,
            quests: {
              create: {
                slug: questSlug,
                title: "Integration Quest",
                description: "A published quest",
                status: "PUBLISHED",
                difficulty: "BEGINNER",
                position: 1,
                lessons: {
                  create: {
                    slug: "integration-lesson",
                    title: "Integration Lesson",
                    content: "Visible lesson content",
                    position: 1,
                  },
                },
                exercises: {
                  create: {
                    slug: "integration-exercise",
                    title: "Integration Exercise",
                    prompt: "Print 42",
                    kind: "CODE",
                    position: 1,
                    starterCode: "class Main {}",
                    solution: "System.out.println(42);",
                    testCases: {
                      create: {
                        position: 1,
                        expectedOutput: "42",
                        isHidden: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.course.deleteMany({ where: { slug: courseSlug } });
  });

  it("lists published courses", async () => {
    const response = await request(app).get("/courses");
    expect(response.status).toBe(200);
    expect(response.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ slug: courseSlug, questCount: 1, moduleCount: 1 }),
      ]),
    );
  });

  it("returns an ordered course tree", async () => {
    const response = await request(app).get(`/courses/${courseSlug}`);
    expect(response.status).toBe(200);
    expect(response.body.modules[0].quests[0].slug).toBe(questSlug);
  });

  it("returns quest learning content without solutions or test cases", async () => {
    const response = await request(app).get(`/quests/${questSlug}`);
    expect(response.status).toBe(200);
    expect(response.body.exercises[0].starterCode).toBe("class Main {}");
    expect(response.body.exercises[0]).not.toHaveProperty("solution");
    expect(response.body.exercises[0]).not.toHaveProperty("testCases");
    expect(JSON.stringify(response.body)).not.toContain("System.out.println(42)");
  });

  it("uses domain-specific 404 errors", async () => {
    const response = await request(app).get("/quests/does-not-exist");
    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("QUEST_NOT_FOUND");
  });

  it("rejects invalid slug syntax", async () => {
    const response = await request(app).get("/courses/INVALID_SLUG");
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
});
