import { randomUUID } from "node:crypto";
import { env } from "@javaquets/config";
import { AppError } from "../errors/AppError.js";
import { increment, observe } from "../observability/metrics.js";
import type { JavaRunResult } from "./javaRunner.js";

export async function runPythonSource(
  sourceCode: string,
  stdin = "",
  timeoutMs = 5000,
): Promise<JavaRunResult> {
  if (
    !sourceCode.length ||
    Buffer.byteLength(sourceCode) > env.RUNNER_MAX_SOURCE_BYTES ||
    Buffer.byteLength(stdin) > env.RUNNER_MAX_STDIN_BYTES
  ) {
    throw new AppError(
      "RUNNER_INPUT_TOO_LARGE",
      "Execution input is empty or exceeds configured limits",
      400,
    );
  }
  if (!env.RUNNER_SERVICE_URL || !env.RUNNER_SERVICE_TOKEN) {
    throw new AppError(
      "RUNNER_UNAVAILABLE",
      "Python execution environment is not configured",
      503,
    );
  }

  timeoutMs = Math.min(timeoutMs, env.RUNNER_EXECUTION_TIMEOUT_MS);
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new AppError("INVALID_RUNNER_TIMEOUT", "Invalid execution timeout", 400);
  }

  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs + 7000);
  try {
    const response = await fetch(
      `${env.RUNNER_SERVICE_URL.replace(/\/$/, "")}/execute`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${env.RUNNER_SERVICE_TOKEN}`,
          "content-type": "application/json",
          "x-request-id": randomUUID(),
        },
        body: JSON.stringify({ language: "PYTHON", sourceCode, stdin, timeoutMs }),
        signal: controller.signal,
      },
    );
    if (!response.ok) {
      increment("javaquets_runner_executions_total", {
        language: "python",
        outcome: response.status === 503 ? "busy" : "unavailable",
      });
      throw new AppError(
        response.status === 503 ? "RUNNER_BUSY" : "RUNNER_UNAVAILABLE",
        response.status === 503
          ? "Execution capacity is temporarily full"
          : "Python execution service is temporarily unavailable",
        503,
      );
    }
    const result = (await response.json()) as Partial<JavaRunResult>;
    if (
      typeof result.runtimeMs !== "number" ||
      typeof result.stdout !== "string" ||
      typeof result.stderr !== "string" ||
      typeof result.exitCode !== "number" && result.exitCode !== null ||
      typeof result.timedOut !== "boolean" ||
      typeof result.outputLimitExceeded !== "boolean"
    ) {
      throw new Error("Python runner returned an invalid response");
    }
    observe("javaquets_runner_duration_ms", result.runtimeMs);
    increment("javaquets_runner_executions_total", {
      language: "python",
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
    increment("javaquets_runner_executions_total", {
      language: "python",
      outcome: "unavailable",
    });
    throw new AppError(
      "RUNNER_UNAVAILABLE",
      "Python execution service is temporarily unavailable",
      503,
    );
  } finally {
    clearTimeout(timer);
    observe("javaquets_runner_request_duration_ms", Date.now() - started);
  }
}
