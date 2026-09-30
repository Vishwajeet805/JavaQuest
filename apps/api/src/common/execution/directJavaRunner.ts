import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { env } from "@javaquets/config";
import { AppError } from "../errors/AppError.js";
import { increment, observe } from "../observability/metrics.js";
import type { JavaRunResult } from "./javaRunner.js";

// Resource bounds are NOT a sandbox: code runs as the API user and can access
// its filesystem/network. Never pass API secrets into the child environment.
// Linux process groups stop ordinary descendants, not deliberately escaped ones.
const childEnv = (cwd: string) => ({
  PATH: process.env.PATH,
  JAVA_HOME: process.env.JAVA_HOME,
  LANG: "C.UTF-8",
  TMPDIR: cwd,
  TEMP: cwd,
  TMP: cwd,
  ...(process.platform === "win32"
    ? { SystemRoot: process.env.SystemRoot }
    : {}),
});

function runProcess(
  command: string,
  args: string[],
  cwd: string,
  stdin: string,
  timeoutMs: number,
  outputBudget = env.RUNNER_MAX_OUTPUT_BYTES,
): Promise<JavaRunResult> {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const grouped = process.platform !== "win32";
    const child = spawn(command, args, {
      cwd,
      env: childEnv(cwd),
      detached: grouped,
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true,
    });
    const stdout: Buffer[] = [],
      stderr: Buffer[] = [];
    let bytes = 0,
      timedOut = false,
      outputLimitExceeded = false,
      infrastructureFailed = false,
      stopped = false,
      terminationRequested = false;
    const terminate = () => {
      if (terminationRequested) return;
      terminationRequested = true;
      try {
        if (grouped && child.pid) process.kill(-child.pid, "SIGKILL");
        else child.kill("SIGKILL");
      } catch {
        // A vanished group is harmless; still try the child itself if group kill fails.
        child.kill("SIGKILL");
      }
    };
    const stop = () => {
      if (stopped) return;
      stopped = true;
      clearTimeout(timer);
      terminate();
      child.stdin.destroy();
      child.stdout.destroy();
      child.stderr.destroy();
    };
    const timer = setTimeout(() => {
      if (!stopped) {
        timedOut = true;
        stop();
      }
    }, timeoutMs);
    const append = (target: Buffer[], chunk: Buffer) => {
      if (stopped) return;
      const remaining = Math.max(0, outputBudget - bytes);
      const retained = chunk.subarray(0, remaining);
      if (retained.length) target.push(Buffer.from(retained));
      bytes += retained.length;
      if (chunk.length > remaining) {
        outputLimitExceeded = true;
        stop();
      }
    };
    child.stdout.on("data", (chunk: Buffer) => append(stdout, chunk));
    child.stderr.on("data", (chunk: Buffer) => append(stderr, chunk));
    const ioError = (error: NodeJS.ErrnoException) => {
      // EPIPE means the learner exited without consuming all input.
      if (stopped || error.code === "EPIPE") return;
      infrastructureFailed = true;
      stop();
    };
    child.stdin.on("error", ioError);
    child.stdout.on("error", ioError);
    child.stderr.on("error", ioError);
    child.on("error", () => {
      infrastructureFailed = true;
      stop();
    });
    // Kill remaining group members even when Main exits normally.
    child.on("exit", terminate);
    child.on("close", (exitCode) => {
      clearTimeout(timer);
      if (infrastructureFailed) {
        reject(
          new AppError(
            "RUNNER_UNAVAILABLE",
            "Java toolchain or process I/O is unavailable",
            503,
          ),
        );
        return;
      }
      const decode = (chunks: Buffer[], limit: number) => {
        const decoded = Buffer.concat(chunks).toString("utf8");
        let value = Buffer.from(decoded).subarray(0, limit).toString("utf8");
        while (Buffer.byteLength(value) > limit) value = value.slice(0, -1);
        return value;
      };
      const out = decode(stdout, outputBudget);
      const err = decode(stderr, outputBudget - Buffer.byteLength(out));
      resolve({
        exitCode,
        stdout: out,
        stderr: err,
        runtimeMs: Date.now() - started,
        timedOut,
        outputLimitExceeded,
      });
    });
    child.stdin.end(stdin);
  });
}

export async function checkDirectJava(): Promise<boolean> {
  try {
    for (const command of ["javac", "java"]) {
      const result = await runProcess(
        command,
        ["-version"],
        tmpdir(),
        "",
        3000,
      );
      if (
        result.exitCode !== 0 ||
        result.timedOut ||
        result.outputLimitExceeded
      )
        return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function runDirectJava(
  sourceCode: string,
  stdin: string,
  timeoutMs: number,
): Promise<JavaRunResult> {
  let dir: string | undefined;
  const started = Date.now();
  try {
    dir = await mkdtemp(join(tmpdir(), "javaquets-direct-"));
    await writeFile(join(dir, "Main.java"), sourceCode, "utf8");
    // Disable annotation processing and use only this workspace's classpath.
    const compiled = await runProcess(
      "javac",
      [
        "-J-Xmx64m",
        "-proc:none",
        "-encoding",
        "UTF-8",
        "-cp",
        dir,
        "Main.java",
      ],
      dir,
      "",
      env.RUNNER_COMPILE_TIMEOUT_MS,
    );
    const result =
      compiled.exitCode !== 0 ||
      compiled.timedOut ||
      compiled.outputLimitExceeded
        ? compiled
        : await runProcess(
            "java",
            [
              "-Xmx64m",
              "-XX:MaxMetaspaceSize=64m",
              "-XX:ActiveProcessorCount=1",
              "-cp",
              dir,
              "Main",
            ],
            dir,
            stdin,
            timeoutMs,
            env.RUNNER_MAX_OUTPUT_BYTES -
              Buffer.byteLength(compiled.stdout) -
              Buffer.byteLength(compiled.stderr),
          );
    if (result !== compiled) {
      result.stdout = compiled.stdout + result.stdout;
      result.stderr = compiled.stderr + result.stderr;
    }
    result.runtimeMs = Date.now() - started;
    increment("javaquets_runner_executions_total", {
      outcome: result.timedOut
        ? "timeout"
        : result.outputLimitExceeded
          ? "output_limit"
          : result.exitCode === 0
            ? "success"
            : "error",
    });
    observe("javaquets_runner_duration_ms", result.runtimeMs);
    return result;
  } catch (error) {
    increment("javaquets_runner_executions_total", { outcome: "unavailable" });
    if (error instanceof AppError) throw error;
    throw new AppError(
      "RUNNER_UNAVAILABLE",
      "Java execution workspace is unavailable",
      503,
    );
  } finally {
    try {
      if (dir)
        await rm(dir, {
          recursive: true,
          force: true,
          maxRetries: 3,
          retryDelay: 100,
        });
    } catch {
      // Preserve the learner result/original error; never record raw paths or errors.
      increment("javaquets_runner_cleanup_failures_total", {
        provider: "direct",
      });
    } finally {
      observe("javaquets_runner_request_duration_ms", Date.now() - started);
    }
  }
}
