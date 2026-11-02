import { randomUUID } from "node:crypto";
import { env } from "@javaquets/config";
import { AppError } from "../errors/AppError.js";
import { increment, observe } from "../observability/metrics.js";
import type { JavaRunResult } from "./javaRunner.js";

export async function runPythonSource(
  sourceCode: string,
  stdin = "",
  timeoutMs = 5000,
  files?: { path: string; content: string }[],
): Promise<JavaRunResult> {
  const allFiles = [{ path: "main.py", content: sourceCode }, ...(files ?? [])];
  const totalBytes = allFiles.reduce((total, file) => total + Buffer.byteLength(file.content), 0);
  const paths = new Set<string>();
  if (
    !sourceCode.length ||
    Buffer.byteLength(sourceCode) > env.RUNNER_MAX_SOURCE_BYTES ||
    Buffer.byteLength(stdin) > env.RUNNER_MAX_STDIN_BYTES ||
    allFiles.length > 20 ||
    totalBytes > 100_000 ||
    allFiles.some((file) => {
      const valid = /^[a-zA-Z0-9_./-]+\.py$/.test(file.path) &&
        !file.path.startsWith("/") &&
        !file.path.split("/").some((part) => !part || part === "." || part === "..") &&
        !paths.has(file.path);
      paths.add(file.path);
      return !valid;
    })
  ) {
    throw new AppError("RUNNER_INPUT_TOO_LARGE", "Python source files are invalid or exceed configured limits", 400);
  }
  if (!env.RUNNER_SERVICE_URL || !env.RUNNER_SERVICE_TOKEN) {
    throw new AppError("RUNNER_UNAVAILABLE", "Python execution environment is not configured", 503);
  }

  timeoutMs = Math.min(timeoutMs, env.RUNNER_EXECUTION_TIMEOUT_MS);
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new AppError("INVALID_RUNNER_TIMEOUT", "Invalid execution timeout", 400);
  }

  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs + 7000);
  try {
    const response = await fetch(`${env.RUNNER_SERVICE_URL.replace(/\/$/, "")}/execute`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.RUNNER_SERVICE_TOKEN}`,
        "content-type": "application/json",
        "x-request-id": randomUUID(),
      },
      body: JSON.stringify({ language: "PYTHON", sourceCode, files: allFiles, stdin, timeoutMs }),
      signal: controller.signal,
    });
    if (!response.ok) {
      increment("javaquets_runner_executions_total", { language: "python", outcome: response.status === 503 ? "busy" : "unavailable" });
      throw new AppError(response.status === 503 ? "RUNNER_BUSY" : "RUNNER_UNAVAILABLE",
        response.status === 503 ? "Execution capacity is temporarily full" : "Python execution service is temporarily unavailable", 503);
    }
    const result = (await response.json()) as Partial<JavaRunResult>;
    if (typeof result.runtimeMs !== "number" || typeof result.stdout !== "string" ||
      typeof result.stderr !== "string" || (typeof result.exitCode !== "number" && result.exitCode !== null) ||
      typeof result.timedOut !== "boolean" || typeof result.outputLimitExceeded !== "boolean") {
      throw new Error("Python runner returned an invalid response");
    }
    observe("javaquets_runner_duration_ms", result.runtimeMs);
    increment("javaquets_runner_executions_total", { language: "python", outcome: result.timedOut ? "timeout" : result.outputLimitExceeded ? "output_limit" : result.exitCode === 0 ? "success" : "error" });
    return result as JavaRunResult;
  } catch (error) {
    if (error instanceof AppError) throw error;
    increment("javaquets_runner_executions_total", { language: "python", outcome: "unavailable" });
    throw new AppError("RUNNER_UNAVAILABLE", "Python execution service is temporarily unavailable", 503);
  } finally {
    clearTimeout(timer);
    observe("javaquets_runner_request_duration_ms", Date.now() - started);
  }
}
