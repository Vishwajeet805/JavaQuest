import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  run: vi.fn(),
  complete: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
}));
vi.mock("../../common/execution/javaRunner.js", () => ({
  runJavaSource: mocks.run,
}));
vi.mock("../progress/progress.service.js", () => ({
  completeExercise: mocks.complete,
}));
vi.mock("@javaquets/database", () => ({
  prisma: {
    exercise: {
      findFirst: vi.fn(async () => ({
        id: "e",
        kind: "CODE",
        executionTimeoutMs: 5000,
        testCases: [
          { position: 1, input: "", expectedOutput: "ok", isHidden: false },
        ],
        quest: { module: { course: { id: "c" } } },
      })),
    },
    enrollment: { findUnique: vi.fn(async () => ({ id: "enrolled" })) },
    submission: { create: mocks.create, update: mocks.update },
  },
}));
import { submitCode } from "./submission.service.js";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.create.mockResolvedValue({ id: "s" });
  mocks.update.mockImplementation(async ({ data }) => ({
    id: "s",
    createdAt: new Date(),
    ...data,
  }));
});
describe("submission semantics with runner results", () => {
  it.each([
    ["correct output", { stdout: "ok\n" }, "PASSED"],
    ["wrong output", { stdout: "wrong" }, "FAILED"],
    ["compiler/runtime error", { exitCode: 1, stderr: "error" }, "ERROR"],
    ["timeout", { timedOut: true, exitCode: null }, "ERROR"],
    ["output limit", { outputLimitExceeded: true, exitCode: null }, "ERROR"],
  ])("preserves %s behavior", async (_name, overrides, status) => {
    mocks.run.mockResolvedValue({
      stdout: "",
      stderr: "",
      exitCode: 0,
      runtimeMs: 10,
      timedOut: false,
      outputLimitExceeded: false,
      ...overrides,
    });
    const result = await submitCode("u", "q", "e", "source");
    expect(result.status).toBe(status);
    expect(result.score).toBe(status === "PASSED" ? 100 : 0);
    expect(mocks.complete).toHaveBeenCalledTimes(status === "PASSED" ? 1 : 0);
  });
  it("does not award XP for infrastructure failure", async () => {
    mocks.run.mockRejectedValue(new Error("unavailable"));
    expect((await submitCode("u", "q", "e", "source")).status).toBe("ERROR");
    expect(mocks.complete).not.toHaveBeenCalled();
  });
});
