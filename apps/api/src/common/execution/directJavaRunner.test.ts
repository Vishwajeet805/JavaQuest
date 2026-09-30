import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import type * as FsPromises from "node:fs/promises";
import type * as Metrics from "../observability/metrics.js";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { env } from "@javaquets/config";
import { increment, observe } from "../observability/metrics.js";
vi.mock("node:fs/promises", async (importOriginal) => {
  const actual = await importOriginal<typeof FsPromises>();
  return { ...actual, rm: vi.fn(actual.rm), mkdtemp: vi.fn(actual.mkdtemp) };
});
vi.mock("../observability/metrics.js", async (importOriginal) => {
  const actual = await importOriginal<typeof Metrics>();
  return {
    ...actual,
    increment: vi.fn(actual.increment),
    observe: vi.fn(actual.observe),
  };
});
import { runJavaSource } from "./javaRunner.js";
import { checkDirectJava } from "./directJavaRunner.js";

const main = (body: string) =>
  `public class Main { public static void main(String[] args) throws Exception { ${body} } }`;
const workspaces = async () =>
  (await readdir(tmpdir())).filter((name) =>
    name.startsWith("javaquets-direct-"),
  );

describe("direct JDK execution (requires javac/java; never silently skips)", () => {
  let root: string;
  const tempKeys = ["TMPDIR", "TEMP", "TMP"] as const;
  const oldTemp = tempKeys.map((key) => process.env[key]);
  const oldProvider = env.JAVA_RUNNER_PROVIDER;
  beforeAll(async () => {
    root = await mkdtemp(join(tmpdir(), "javaquets-test-"));
    for (const key of tempKeys) process.env[key] = root;
    env.JAVA_RUNNER_PROVIDER = "direct";
    expect(
      await checkDirectJava(),
      "Install JDK 21 and put java/javac on PATH",
    ).toBe(true);
  });
  afterAll(async () => {
    tempKeys.forEach((key, index) => {
      if (oldTemp[index] === undefined) delete process.env[key];
      else process.env[key] = oldTemp[index];
    });
    env.JAVA_RUNNER_PROVIDER = oldProvider;
    if (root) await rm(root, { recursive: true, force: true });
  });
  afterEach(async () => {
    expect(await workspaces()).toEqual([]);
  });
  it("executes basic Main", async () => {
    const result = await runJavaSource(
      main('System.out.println("Hello JavaQuets");'),
    );
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe("Hello JavaQuets\n");
  });
  it("supports multiple top-level classes", async () => {
    const result = await runJavaSource(
      `class Quest {} ${main('System.out.println("Hello JavaQuets");')}`,
    );
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe("Hello JavaQuets\n");
  });
  it("executes the Week 3 object exercise unchanged", async () => {
    const result = await runJavaSource(
      `class Quest { String title; int xpReward; } ${main('Quest quest = new Quest(); quest.title = "Object Basics"; quest.xpReward = 100; System.out.println(quest.title); System.out.println(quest.xpReward);')}`,
    );
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe("Object Basics\n100\n");
  });
  it("returns compiler errors", async () => {
    const result = await runJavaSource(main("invalid java;"));
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain("error");
    expect(result.timedOut).toBe(false);
  });
  it("returns runtime exceptions", async () => {
    const result = await runJavaSource(
      main('throw new RuntimeException("example");'),
    );
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain("RuntimeException: example");
  });
  it("terminates infinite loops", async () => {
    const result = await runJavaSource(main("while (true) {}"), "", 200);
    expect(result.timedOut).toBe(true);
    expect(result.runtimeMs).toBeLessThan(env.RUNNER_COMPILE_TIMEOUT_MS + 2000);
  });
  it("caps combined output and terminates unlimited printing", async () => {
    const result = await runJavaSource(
      main(
        'while (true) { System.out.print("abcdefghij"); System.err.print("abcdefghij"); }',
      ),
    );
    expect(result.outputLimitExceeded).toBe(true);
    expect(
      Buffer.byteLength(result.stdout) + Buffer.byteLength(result.stderr),
    ).toBeLessThanOrEqual(env.RUNNER_MAX_OUTPUT_BYTES);
  });
  it("feeds testcase stdin", async () => {
    const result = await runJavaSource(
      main(
        "java.util.Scanner scanner = new java.util.Scanner(System.in); System.out.println(scanner.nextLine());",
      ),
      "hello stdin\n",
    );
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe("hello stdin\n");
  });
  it("does not inherit API secrets", async () => {
    process.env.JAVAQUEST_TEST_SECRET = "private";
    try {
      const result = await runJavaSource(
        main('System.out.println(System.getenv("JAVAQUEST_TEST_SECRET"));'),
      );
      expect(result.stdout).toBe("null\n");
    } finally {
      delete process.env.JAVAQUEST_TEST_SECRET;
    }
  });
  it("rejects oversized input before creating a workspace", async () => {
    await expect(
      runJavaSource("x".repeat(env.RUNNER_MAX_SOURCE_BYTES + 1)),
    ).rejects.toMatchObject({ code: "RUNNER_INPUT_TOO_LARGE" });
    await expect(
      runJavaSource(main(""), "x".repeat(env.RUNNER_MAX_STDIN_BYTES + 1)),
    ).rejects.toMatchObject({ code: "RUNNER_INPUT_TOO_LARGE" });
  });
  it("uses UTF-8 byte limits rather than character counts", async () => {
    await expect(
      runJavaSource(
        "é".repeat(Math.floor(env.RUNNER_MAX_SOURCE_BYTES / 2) + 1),
      ),
    ).rejects.toMatchObject({ code: "RUNNER_INPUT_TOO_LARGE" });
    await expect(
      runJavaSource(
        main(""),
        "é".repeat(Math.floor(env.RUNNER_MAX_STDIN_BYTES / 2) + 1),
      ),
    ).rejects.toMatchObject({ code: "RUNNER_INPUT_TOO_LARGE" });
  });
  it("caps multibyte output", async () => {
    const result = await runJavaSource(
      main('while (true) System.out.print("🙂");'),
    );
    expect(result.outputLimitExceeded).toBe(true);
    expect(result.timedOut).toBe(false);
    expect(
      Buffer.byteLength(result.stdout) + Buffer.byteLength(result.stderr),
    ).toBeLessThanOrEqual(env.RUNNER_MAX_OUTPUT_BYTES);
  });
  it("handles early stdin closure without crashing", async () => {
    const result = await runJavaSource(
      main('System.out.println("ok");'),
      "x".repeat(env.RUNNER_MAX_STDIN_BYTES),
    );
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe("ok\n");
  });
  const descendantStopped = async (pid: number) => {
    try {
      const status = await readFile(`/proc/${pid}/status`, "utf8");
      // Host PID 1 may leave a killed orphan as a zombie until reaped.
      return /^State:\s+Z/m.test(status);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return true;
      throw error;
    }
  };
  it.skipIf(process.platform !== "linux").each([true, false])(
    "kills ordinary Java descendants (Main waits: %s)",
    async (wait) => {
      const source = `class Child { public static void main(String[] args) { while (true) {} } } ${main('Process child = new ProcessBuilder(System.getProperty("java.home") + "/bin/java", "-Xmx32m", "-cp", System.getProperty("java.class.path"), "Child").inheritIO().start(); System.out.println(child.pid());' + (wait ? "while (true) {}" : ""))}`;
      const result = await runJavaSource(source, "", 700);
      expect(result.timedOut).toBe(wait);
      if (!wait) expect(result.exitCode).toBe(0);
      const pid = Number(result.stdout.trim());
      expect(Number.isInteger(pid) && pid > 0).toBe(true);
      await expect
        .poll(() => descendantStopped(pid), { timeout: 1000 })
        .toBe(true);
    },
  );
  it("reports missing toolchain gracefully and releases capacity", async () => {
    const path = process.env.PATH;
    try {
      process.env.PATH = "/nonexistent";
      await expect(runJavaSource(main(""))).rejects.toMatchObject({
        code: "RUNNER_UNAVAILABLE",
      });
    } finally {
      process.env.PATH = path;
    }
    expect((await runJavaSource(main(""))).exitCode).toBe(0);
  });
  it("bounds compilation lifetime", async () => {
    const original = env.RUNNER_COMPILE_TIMEOUT_MS;
    try {
      env.RUNNER_COMPILE_TIMEOUT_MS = 1;
      expect((await runJavaSource(main(""))).timedOut).toBe(true);
    } finally {
      env.RUNNER_COMPILE_TIMEOUT_MS = original;
    }
  });
  it.each([
    ["success", main('System.out.println("ok");'), 0],
    ["compiler error", main("invalid java;"), 1],
    ["runtime error", main('throw new RuntimeException("example");'), 1],
  ])(
    "preserves %s result when cleanup fails without double-counting metrics",
    async (_name, source, expectedExit) => {
      vi.mocked(increment).mockClear();
      vi.mocked(observe).mockClear();
      const removal = vi.mocked(rm);
      removal.mockClear();
      removal.mockRejectedValueOnce(
        new Error("learner-controlled/path-must-not-be-recorded"),
      );
      let workspace: Parameters<typeof rm>[0] | undefined;
      try {
        const result = await runJavaSource(source);
        workspace = removal.mock.calls[0]?.[0];
        expect(result.exitCode).toBe(expectedExit);
        if (expectedExit === 0) expect(result.stdout).toBe("ok\n");
        else expect(result.stderr).not.toBe("");
        expect(removal).toHaveBeenCalledWith(expect.any(String), {
          recursive: true,
          force: true,
          maxRetries: 3,
          retryDelay: 100,
        });
        expect(
          vi
            .mocked(increment)
            .mock.calls.filter(
              ([name]) => name === "javaquets_runner_cleanup_failures_total",
            ),
        ).toEqual([
          ["javaquets_runner_cleanup_failures_total", { provider: "direct" }],
        ]);
        expect(
          vi
            .mocked(increment)
            .mock.calls.filter(
              ([name]) => name === "javaquets_runner_executions_total",
            ),
        ).toHaveLength(1);
        for (const metric of [
          "javaquets_runner_duration_ms",
          "javaquets_runner_request_duration_ms",
        ]) {
          expect(
            vi.mocked(observe).mock.calls.filter(([name]) => name === metric),
          ).toHaveLength(1);
        }
        expect(
          vi
            .mocked(increment)
            .mock.calls.filter(([name]) => name === "javaquets_runner_active"),
        ).toEqual([
          ["javaquets_runner_active", {}, 1],
          ["javaquets_runner_active", {}, -1],
        ]);
      } finally {
        workspace ??= removal.mock.calls[0]?.[0];
        if (workspace) await rm(workspace, { recursive: true, force: true });
      }
    },
  );
  it("retains infrastructure errors and records metrics once when workspace creation fails", async () => {
    vi.mocked(increment).mockClear();
    vi.mocked(observe).mockClear();
    vi.mocked(mkdtemp).mockRejectedValueOnce(
      new Error("private-workspace-path"),
    );
    await expect(runJavaSource(main(""))).rejects.toMatchObject({
      code: "RUNNER_UNAVAILABLE",
      message: "Java execution workspace is unavailable",
    });
    expect(
      vi
        .mocked(increment)
        .mock.calls.filter(
          ([name]) => name === "javaquets_runner_executions_total",
        ),
    ).toEqual([
      ["javaquets_runner_executions_total", { outcome: "unavailable" }],
    ]);
    expect(
      vi
        .mocked(observe)
        .mock.calls.filter(([name]) => name === "javaquets_runner_duration_ms"),
    ).toHaveLength(0);
    expect(
      vi
        .mocked(observe)
        .mock.calls.filter(
          ([name]) => name === "javaquets_runner_request_duration_ms",
        ),
    ).toHaveLength(1);
    expect(
      vi
        .mocked(increment)
        .mock.calls.filter(([name]) => name === "javaquets_runner_active"),
    ).toEqual([
      ["javaquets_runner_active", {}, 1],
      ["javaquets_runner_active", {}, -1],
    ]);
  });
  it("limits concurrency and rejects overflow", async () => {
    const concurrency = env.RUNNER_MAX_CONCURRENCY,
      queue = env.RUNNER_MAX_QUEUE;
    try {
      env.RUNNER_MAX_CONCURRENCY = 1;
      env.RUNNER_MAX_QUEUE = 1;
      const first = runJavaSource(main("Thread.sleep(300);"));
      const second = runJavaSource(main(""));
      await expect(runJavaSource(main(""))).rejects.toMatchObject({
        code: "RUNNER_BUSY",
      });
      const results = await Promise.all([first, second]);
      expect(results.map((result) => result.exitCode)).toEqual([0, 0]);
    } finally {
      env.RUNNER_MAX_CONCURRENCY = concurrency;
      env.RUNNER_MAX_QUEUE = queue;
    }
  });
});
