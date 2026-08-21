import { prisma } from "@javaquets/database";
import type { SubmissionResultDto } from "@javaquets/shared";
import { AppError, NotFoundError } from "../../common/errors/AppError.js";
import { runJavaSource } from "../../common/execution/javaRunner.js";
import { completeExercise } from "../progress/progress.service.js";

function normalize(value: string) { return value.replace(/\r\n/g, "\n").trimEnd(); }

export async function submitCode(userId: string, questSlug: string, exerciseSlug: string, sourceCode: string): Promise<SubmissionResultDto> {
  const exercise = await prisma.exercise.findFirst({
    where: { slug: exerciseSlug, quest: { slug: questSlug, status: "PUBLISHED", module: { course: { status: "PUBLISHED" } } } },
    include: { testCases: { orderBy: { position: "asc" } }, quest: { include: { module: { include: { course: true } } } } },
  });
  if (!exercise) throw new NotFoundError("EXERCISE_NOT_FOUND", "Exercise not found");
  if (exercise.kind !== "CODE") throw new AppError("CODE_SUBMISSION_NOT_SUPPORTED", "This exercise does not accept Java source submissions", 409);
  const enrollment = await prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId: exercise.quest.module.course.id } } });
  if (!enrollment) throw new AppError("COURSE_ENROLLMENT_REQUIRED", "Enroll in the course before submitting code", 409);

  const submission = await prisma.submission.create({ data: { userId, exerciseId: exercise.id, sourceCode, status: "PENDING" } });
  const testResults: SubmissionResultDto["tests"] = [];
  let totalRuntime = 0;
  let status: "PASSED" | "FAILED" | "ERROR" = "PASSED";
  let errorText: string | null = null;

  for (const test of exercise.testCases) {
    let result;
    try { result = await runJavaSource(sourceCode, test.input ?? "", exercise.executionTimeoutMs); }
    catch (error) {
      status = "ERROR";
      errorText = error instanceof Error ? `Runner unavailable: ${error.message}` : "Runner unavailable";
      break;
    }
    totalRuntime += result.runtimeMs;
    if (result.timedOut || result.outputLimitExceeded || result.exitCode !== 0) {
      status = "ERROR";
      errorText = result.timedOut ? "Execution timed out" : result.outputLimitExceeded ? "Execution output limit exceeded" : (result.stderr || "Compilation or runtime error");
      testResults.push({ position: test.position, hidden: test.isHidden, passed: false, stdout: test.isHidden ? null : result.stdout });
      break;
    }
    const passed = normalize(result.stdout) === normalize(test.expectedOutput);
    testResults.push({ position: test.position, hidden: test.isHidden, passed, stdout: test.isHidden ? null : result.stdout });
    if (!passed) status = "FAILED";
  }

  const score = status === "PASSED" ? 100 : 0;
  const saved = await prisma.submission.update({ where: { id: submission.id }, data: { status, score, runtimeMs: totalRuntime || null, errorText } });
  if (status === "PASSED") await completeExercise(userId, questSlug, exerciseSlug, { evaluatorVerified: true });

  return { id: saved.id, questSlug, exerciseSlug, status, score, runtimeMs: saved.runtimeMs, errorText: saved.errorText, tests: testResults, createdAt: saved.createdAt.toISOString() };
}
