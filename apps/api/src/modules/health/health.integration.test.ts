import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../app.js";

describe("GET /health", () => {
  const app = createApp();

  it("reports API and database connectivity", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: "ok",
      service: "javaquets-api",
      database: "connected",
      runner: "ready",
    });
  });
});
