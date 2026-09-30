import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFile, spawn } from "node:child_process";
import { runDirectJava } from "./directJavaRunner.js";
import { randomUUID } from "node:crypto";
import { env } from "@javaquets/config";
import { AppError } from "../errors/AppError.js";
import { increment, observe } from "../observability/metrics.js";

export type JavaRunResult = {
  exitCode: number | null;
  stdout: string;
  stderr: string;
  runtimeMs: number;
  timedOut: boolean;
  outputLimitExceeded: boolean;
};
type OnlineCompilerResponse = {
  output?: string;
  error?: string;
  status?: string;
  exit_code?: number;
  signal?: number | null;
  time?: string;
  total?: string;
  memory?: string;
};

async function runOnlineCompiler(
  sourceCode: string,
  stdin: string,
  timeoutMs: number,
): Promise<JavaRunResult> {
  const started = Date.now();

  const controller = new AbortController();

  // OnlineCompiler sync API may run for up to 30s.
  const clientTimeout = Math.min(Math.max(timeoutMs + 7000, 10000), 35000);

  const timer = setTimeout(() => controller.abort(), clientTimeout);

  try {
    const response = await fetch(
      "https://api.onlinecompiler.io/api/run-code-sync/",
      {
        method: "POST",
        headers: {
          Authorization: env.ONLINECOMPILER_API_KEY!,
          "Content-Type": "application/json",
          "X-Request-Id": randomUUID(),
        },
        body: JSON.stringify({
          compiler: "openjdk-25",
          code: sourceCode,
          input: stdin,
        }),
        signal: controller.signal,
      },
    );
    if (!response.ok) {
      increment("javaquets_runner_executions_total", {
        outcome: response.status === 429 ? "busy" : "unavailable",
      });

      throw new AppError(
        response.status === 429 ? "RUNNER_BUSY" : "RUNNER_UNAVAILABLE",
        response.status === 429
          ? "Execution capacity is temporarily full"
          : "Execution service is temporarily unavailable",
        503,
      );
    }

    const result = (await response.json()) as OnlineCompilerResponse;
    if (
      typeof result.output !== "string" ||
      typeof result.error !== "string" ||
      typeof result.exit_code !== "number"
    ) {
      throw new Error("OnlineCompiler returned an invalid response");
    }

    const runtimeMs = Number.isFinite(Number(result.time))
      ? Math.round(Number(result.time) * 1000)
      : Date.now() - started;

    const timedOut =
      result.exit_code === 124 ||
      result.exit_code === 137 ||
      result.signal === 9;

    const stdout = result.output.slice(0, env.RUNNER_MAX_OUTPUT_BYTES);
    const stderr = result.error.slice(0, env.RUNNER_MAX_OUTPUT_BYTES);

    const outputLimitExceeded =
      Buffer.byteLength(result.output) + Buffer.byteLength(result.error) >
      env.RUNNER_MAX_OUTPUT_BYTES;

    observe("javaquets_runner_duration_ms", runtimeMs);

    increment("javaquets_runner_executions_total", {
      outcome: timedOut
        ? "timeout"
        : outputLimitExceeded
          ? "output_limit"
          : result.exit_code === 0
            ? "success"
            : "error",
    });

    return {
      exitCode: result.exit_code,
      stdout,
      stderr,
      runtimeMs,
      timedOut,
      outputLimitExceeded,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    increment("javaquets_runner_executions_total", { outcome: "unavailable" });
    throw new AppError(
      "RUNNER_UNAVAILABLE",
      "Execution service is temporarily unavailable",
      503,
    );
  } finally {
    clearTimeout(timer);
    observe("javaquets_runner_request_duration_ms", Date.now() - started);
  }
}
async function runRemotely(
  sourceCode: string,
  stdin: string,
  timeoutMs: number,
): Promise<JavaRunResult> {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs + 7000);
  try {
    const response = await fetch(
      `${env.RUNNER_SERVICE_URL!.replace(/\/$/, "")}/execute`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${env.RUNNER_SERVICE_TOKEN}`,
          "content-type": "application/json",
          "x-request-id": randomUUID(),
        },
        body: JSON.stringify({ sourceCode, stdin, timeoutMs }),
        signal: controller.signal,
      },
    );
    if (!response.ok) {
      increment("javaquets_runner_executions_total", {
        outcome: response.status === 503 ? "busy" : "unavailable",
      });
      throw new AppError(
        response.status === 503 ? "RUNNER_BUSY" : "RUNNER_UNAVAILABLE",
        response.status === 503
          ? "Execution capacity is temporarily full"
          : "Execution service is temporarily unavailable",
        503,
      );
    }
    const result = (await response.json()) as Partial<JavaRunResult>;
    if (
      typeof result.runtimeMs !== "number" ||
      typeof result.stdout !== "string" ||
      typeof result.stderr !== "string"
    ) {
      throw new Error("Runner returned an invalid response");
    }
    observe("javaquets_runner_duration_ms", result.runtimeMs);
    increment("javaquets_runner_executions_total", {
      outcome: result.timedOut
        ? "timeout"
        : result.outputLimitExceeded
          ? "output_limit"
          : result.exitCode === 0
            ? "success"
            : "error",
    });
    return result as JavaRunResult;
  } catch (error) {
    if (error instanceof AppError) throw error;
    increment("javaquets_runner_executions_total", { outcome: "unavailable" });
    throw new AppError(
      "RUNNER_UNAVAILABLE",
      "Execution service is temporarily unavailable",
      503,
    );
  } finally {
    clearTimeout(timer);
    observe("javaquets_runner_request_duration_ms", Date.now() - started);
  }
}
let active = 0;
const waiters: Array<() => void> = [];

async function acquire() {
  if (active >= env.RUNNER_MAX_CONCURRENCY) {
    if (waiters.length >= env.RUNNER_MAX_QUEUE) {
      increment("javaquets_runner_rejections_total", { reason: "queue_full" });
      throw new AppError(
        "RUNNER_BUSY",
        "Execution capacity is temporarily full",
        503,
      );
    }
    await new Promise<void>((resolve) => waiters.push(resolve));
  } else {
    active += 1;
  }
  increment("javaquets_runner_active", {}, 1);
  let released = false;
  return () => {
    if (released) return;
    released = true;
    increment("javaquets_runner_active", {}, -1);
    const next = waiters.shift();
    if (next) next();
    else active -= 1;
  };
}
function removeContainer(name: string) {
  return new Promise<void>((resolve) =>
    execFile(
      "docker",
      ["rm", "-f", name],
      { timeout: 3000, windowsHide: true },
      () => resolve(),
    ),
  );
}

export async function runJavaSource(
  sourceCode: string,
  stdin = "",
  timeoutMs = 5000,
): Promise<JavaRunResult> {
  if (
    Buffer.byteLength(sourceCode) > env.RUNNER_MAX_SOURCE_BYTES ||
    !sourceCode.length ||
    Buffer.byteLength(stdin) > env.RUNNER_MAX_STDIN_BYTES
  ) {
    throw new AppError(
      "RUNNER_INPUT_TOO_LARGE",
      "Execution input is empty or exceeds configured limits",
      400,
    );
  }
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0)
    throw new AppError(
      "INVALID_RUNNER_TIMEOUT",
      "Invalid execution timeout",
      400,
    );
  timeoutMs = Math.min(timeoutMs, env.RUNNER_EXECUTION_TIMEOUT_MS);
  const release = await acquire();
  try {
    if (env.JAVA_RUNNER_PROVIDER === "direct")
      return await runDirectJava(sourceCode, stdin, timeoutMs);
    if (env.JAVA_RUNNER_PROVIDER === "onlinecompiler")
      return await runOnlineCompiler(sourceCode, stdin, timeoutMs);
    if (env.JAVA_RUNNER_PROVIDER === "remote")
      return await runRemotely(sourceCode, stdin, timeoutMs);
    return await runDocker(sourceCode, stdin, timeoutMs);
  } finally {
    release();
  }
}

async function runDocker(
  sourceCode: string,
  stdin: string,
  timeoutMs: number,
): Promise<JavaRunResult> {
  const containerName = `javaquets-${randomUUID()}`;
  let dir: string | undefined;
  try {
    dir = await mkdtemp(join(tmpdir(), "javaquets-run-"));
    await writeFile(join(dir, "Main.java"), sourceCode, "utf8");
    const started = Date.now();
    return await new Promise((resolve, reject) => {
      const child = spawn(
        "docker",
        [
          "run",
          "--name",
          containerName,
          "--rm",
          "--network",
          "none",
          "--memory",
          "128m",
          "--cpus",
          "0.5",
          "--pids-limit",
          "64",
          "--read-only",
          "--tmpfs",
          "/tmp:rw,noexec,nosuid,size=16m",
          "--security-opt",
          "no-new-privileges",
          "--cap-drop",
          "ALL",
          "-v",
          `${dir}:/workspace:rw`,
          "-w",
          "/workspace",
          env.JAVA_RUNNER_IMAGE,
          "sh",
          "-lc",
          `javac Main.java && timeout ${Math.max(1, Math.ceil(timeoutMs / 1000))}s java -Xmx64m Main`,
        ],
        { stdio: ["pipe", "pipe", "pipe"], windowsHide: true },
      );
      let stdout = "",
        stderr = "",
        timedOut = false,
        outputLimitExceeded = false,
        settled = false;
      const terminate = () => {
        void removeContainer(containerName);
        child.kill("SIGKILL");
      };
      const timer = setTimeout(() => {
        timedOut = true;
        terminate();
      }, timeoutMs + 5000);
      const append = (target: "stdout" | "stderr", chunk: Buffer) => {
        const text = chunk.toString();
        if (target === "stdout") stdout += text;
        else stderr += text;
        if (
          Buffer.byteLength(stdout) + Buffer.byteLength(stderr) >
          env.RUNNER_MAX_OUTPUT_BYTES
        ) {
          outputLimitExceeded = true;
          terminate();
        }
      };
      child.stdout.on("data", (chunk: Buffer) => append("stdout", chunk));
      child.stderr.on("data", (chunk: Buffer) => append("stderr", chunk));
      child.on("error", (error) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          increment("javaquets_runner_executions_total", {
            outcome: "unavailable",
          });
          reject(error);
        }
      });
      child.on("close", (code) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        const runtimeMs = Date.now() - started;
        increment("javaquets_runner_executions_total", {
          outcome: timedOut
            ? "timeout"
            : outputLimitExceeded
              ? "output_limit"
              : code === 0
                ? "success"
                : "error",
        });
        observe("javaquets_runner_duration_ms", runtimeMs);
        resolve({
          exitCode: code,
          stdout: stdout.slice(0, env.RUNNER_MAX_OUTPUT_BYTES),
          stderr: stderr.slice(0, env.RUNNER_MAX_OUTPUT_BYTES),
          runtimeMs,
          timedOut,
          outputLimitExceeded,
        });
      });
      child.stdin.end(stdin);
    });
  } finally {
    await removeContainer(containerName);
    if (dir) await rm(dir, { recursive: true, force: true });
  }
}
