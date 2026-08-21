import { afterAll, describe, expect, it } from "vitest";
import request from "supertest";
import { prisma } from "@javaquets/database";
import { createApp } from "../../app.js";

describe("GET /health", () => {
  const app = createApp();

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("reports API and database connectivity", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      service: "javaquets-api",
      database: "connected",
    });
  });
});
