"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  ExerciseDto,
  QuestDetail,
  QuestProgressDto,
  SubmissionResultDto,
} from "@javaquets/shared";

import { LessonContent } from "@/components/lesson-content";
import { ErrorState } from "@/components/states";
import { ProgressBar } from "@/components/progress-bar";

import {
  completeExercise,
  getQuestProgress,
  startQuest,
} from "@/services/learner";

import { submitJava } from "@/services/submissions";

export function QuestWorkspace({
  quest,
  nextQuestSlug,
}: {
  quest: QuestDetail;
  nextQuestSlug: string | null;
}) {
  const router = useRouter();

  const items = useMemo(
    () => [
      ...[...quest.lessons]
        .sort((a, b) => a.position - b.position)
        .map((item) => ({
          ...item,
          type: "lesson" as const,
        })),

      ...[...quest.exercises]
        .sort((a, b) => a.position - b.position)
        .map((item) => ({
          ...item,
          type: "exercise" as const,
        })),
    ],
    [quest],
  );

  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState<QuestProgressDto | null>(null);

  const [code, setCode] = useState(quest.exercises[0]?.starterCode ?? "");

  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<SubmissionResultDto | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [answerCorrect, setAnswerCorrect] = useState(false);

  const current = items[index];
  const contentRef = useRef<HTMLDivElement>(null);
  const [progressError, setProgressError] = useState("");
  const drafts = useRef<Record<string, string>>({});

  // =====================================================
  // START QUEST
  // =====================================================

  const loadProgress = useCallback(() => {
    setProgressError("");
    startQuest(quest.slug)
      .then(setProgress)
      .catch(() =>
        getQuestProgress(quest.slug)
          .then(setProgress)
          .catch((e) =>
            setProgressError(
              e instanceof Error ? e.message : "Could not start quest",
            ),
          ),
      );
  }, [quest.slug]);

  useEffect(loadProgress, [loadProgress]);

  // =====================================================
  // RESET CURRENT ITEM STATE
  // =====================================================

  useEffect(() => {
    if (current?.type === "exercise") {
      setCode(drafts.current[current.slug] ?? current.starterCode ?? "");
    }

    setAnswer("");
    setAnswerCorrect(false);
    setResult(null);
    setError("");
    // Draft edits do not reset evaluation or answer state.
  }, [current]);

  // =====================================================
  // EVALUATE EXERCISE
  // =====================================================

  async function evaluate(exercise: ExerciseDto) {
    if (busy) return;
    setBusy(true);
    setError("");

    try {
      if (exercise.kind === "CODE") {
        const submission = await submitJava(quest.slug, exercise.slug, code);

        setResult(submission);

        if (submission.status === "PASSED") {
          const updatedProgress = await getQuestProgress(quest.slug);
          setProgress(updatedProgress);
        }

        return;
      }

      if (!answer.trim()) {
        setError("Enter an answer before checking.");
        return;
      }

      const updatedProgress = await completeExercise(
        quest.slug,
        exercise.slug,
        answer,
      );

      setProgress(updatedProgress);
      setAnswerCorrect(true);
    } catch (e) {
      setAnswerCorrect(false);

      setError(e instanceof Error ? e.message : "Exercise failed");
    } finally {
      setBusy(false);
    }
  }

  // =====================================================
  // NAVIGATION
  // =====================================================

  function selectItem(nextIndex: number) {
    if (busy) return;
    setIndex(nextIndex);
    contentRef.current?.focus();
    contentRef.current?.scrollIntoView({ block: "start" });
  }

  function goNext() {
    if (busy) return;
    const isLastItem = index >= items.length - 1;

    if (!isLastItem) {
      selectItem(index + 1);
      return;
    }

    if (nextQuestSlug) {
      router.push(`/quests/${nextQuestSlug}`);
      return;
    }

    router.push(`/courses/${quest.module.courseSlug}`);
  }

  // =====================================================
  // PROGRESS
  // =====================================================

  const completed = progress?.completedExercises ?? 0;

  const totalExercises = progress?.totalExercises ?? quest.exercises.length;

  const pct = totalExercises > 0 ? (completed / totalExercises) * 100 : 0;

  return (
    <div className="mx-auto w-full max-w-[1500px]">
      {/* =================================================
          TOP NAVIGATION
      ================================================= */}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/courses/${quest.module.courseSlug}`}
          className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-slate-100"
        >
          <span className="transition group-hover:-translate-x-0.5">←</span>

          <span>{quest.module.title}</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <span>Item {Math.min(index + 1, items.length)}</span>
          <span className="text-slate-700">/</span>
          <span>{items.length}</span>
        </div>
      </div>

      {/* =================================================
          QUEST HEADER
      ================================================= */}

      <header className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 px-5 py-5 sm:px-7">
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-amber-300">
                Quest
              </span>

              {progress?.status && (
                <span className="rounded-full border border-slate-700 bg-slate-950/50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  {progress.status.replace(/_/g, " ")}
                </span>
              )}
            </div>

            <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
              {quest.title}
            </h1>

            {quest.description && (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                {quest.description}
              </p>
            )}
          </div>

          <div className="w-full shrink-0 lg:w-72">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400">
                Exercise progress
              </span>

              <span className="font-bold text-slate-200">
                {progress ? `${completed}/${totalExercises}` : "Unavailable"}
              </span>
            </div>

            <ProgressBar
              value={progress ? pct : null}
              label="Exercises completed"
            />
          </div>
        </div>
      </header>

      {/* =================================================
          WORKSPACE
      ================================================= */}

      {progressError && (
        <div className="mt-4">
          <ErrorState message={progressError} retry={loadProgress} />
        </div>
      )}
      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* ===============================================
            QUEST PATH
        =============================================== */}

        <aside className="lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
            <div className="border-b border-slate-800 px-5 py-4">
              <h2 className="eyebrow">Quest path</h2>
              <a
                href="#quest-content"
                className="mt-2 inline-flex min-h-11 items-center text-sm text-amber-300 lg:hidden"
              >
                Jump to current item ↓
              </a>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Learn the concept, then prove it with practice.
              </p>
            </div>

            <div className="max-h-60 overflow-y-auto lg:max-h-[calc(100dvh-220px)] p-2">
              {items.map((item, itemIndex) => {
                const isCurrent = itemIndex === index;

                const done =
                  item.type === "exercise" &&
                  (progress?.completedExerciseSlugs.includes(item.slug) ??
                    false);

                const visitedLesson =
                  item.type === "lesson" && itemIndex < index;

                return (
                  <button
                    key={`${item.type}-${item.slug}`}
                    type="button"
                    disabled={busy}
                    aria-current={isCurrent ? "step" : undefined}
                    onClick={() => selectItem(itemIndex)}
                    className={`group flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition ${
                      isCurrent
                        ? "bg-amber-400/10 text-amber-200 ring-1 ring-inset ring-amber-400/40"
                        : "text-slate-300 hover:bg-slate-800/70"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${
                        isCurrent
                          ? "bg-amber-400 text-slate-950"
                          : done
                            ? "bg-emerald-950 text-emerald-300"
                            : visitedLesson
                              ? "bg-slate-800 text-slate-300"
                              : "bg-slate-950 text-slate-400"
                      }`}
                    >
                      {done
                        ? "✓"
                        : item.type === "lesson"
                          ? "◆"
                          : itemIndex + 1}
                    </span>

                    <span className="min-w-0">
                      <span
                        className={`block text-[10px] font-black uppercase tracking-[0.15em] ${
                          isCurrent ? "text-amber-300" : "text-slate-400"
                        }`}
                      >
                        {item.type === "lesson" ? "Learn" : "Practice"}
                        {isCurrent ? " · Current" : done ? " · Completed" : ""}
                      </span>

                      <span className="mt-0.5 block text-sm font-semibold leading-5">
                        {item.title}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ===============================================
            CURRENT CONTENT
        =============================================== */}

        <div
          id="quest-content"
          ref={contentRef}
          tabIndex={-1}
          className="min-w-0"
        >
          {current?.type === "lesson" ? (
            <Lesson
              title={current.title}
              kind={current.kind}
              content={current.content}
              currentIndex={index}
              totalItems={items.length}
              onNext={goNext}
            />
          ) : current?.type === "exercise" ? (
            <Exercise
              exercise={current}
              code={code}
              setCode={(value) => {
                setCode(value);
                drafts.current[current.slug] = value;
              }}
              answer={answer}
              setAnswer={setAnswer}
              answerCorrect={answerCorrect}
              result={result}
              busy={busy}
              error={error}
              completed={
                progress?.completedExerciseSlugs.includes(current.slug) ?? false
              }
              onRun={() => evaluate(current)}
              onNext={goNext}
            />
          ) : (
            <EmptyQuest />
          )}
        </div>
      </div>
    </div>
  );
}

// =====================================================
// LESSON
// =====================================================

function Lesson({
  title,
  kind,
  content,
  currentIndex,
  totalItems,
  onNext,
}: {
  title: string;
  kind: string;
  content: string;
  currentIndex: number;
  totalItems: number;
  onNext: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60">
      <header className="border-b border-slate-800 px-4 py-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="eyebrow">{kind.replace(/_/g, " ")}</p>

          <span className="text-xs font-semibold text-slate-400">
            {currentIndex + 1} of {totalItems}
          </span>
        </div>

        <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
          {title}
        </h2>
      </header>

      <div className="px-4 py-5 sm:px-6 sm:py-6">
        <div className="mx-auto max-w-4xl">
          <LessonContent content={content} />
        </div>

        <div className="mx-auto mt-6 flex max-w-4xl justify-end border-t border-slate-800 pt-6">
          <button
            type="button"
            className="btn-primary min-w-36"
            onClick={onNext}
          >
            Continue
            <span className="ml-2">→</span>
          </button>
        </div>
      </div>
    </article>
  );
}

// =====================================================
// EXERCISE
// =====================================================

function Exercise({
  exercise,
  code,
  setCode,
  answer,
  setAnswer,
  answerCorrect,
  result,
  busy,
  error,
  completed,
  onRun,
  onNext,
}: {
  exercise: ExerciseDto;
  code: string;
  setCode: (value: string) => void;
  answer: string;
  setAnswer: (value: string) => void;
  answerCorrect: boolean;
  result: SubmissionResultDto | null;
  busy: boolean;
  error: string;
  completed: boolean;
  onRun: () => void;
  onNext: () => void;
}) {
  const passed = result?.status === "PASSED";
  const isCode = exercise.kind === "CODE";
  const isPrediction = exercise.kind === "OUTPUT_PREDICTION";
  const isMultipleChoice = exercise.kind === "MULTIPLE_CHOICE";

  return (
    <div className="space-y-4">
      {/* ===============================================
          CHALLENGE HEADER
      =============================================== */}

      <article className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60">
        <div className="border-b border-slate-800 px-6 py-5 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.17em] text-amber-300">
              {exercise.kind.replace(/_/g, " ")}
            </span>

            {completed && (
              <span className="rounded-full border border-emerald-800 bg-emerald-950/40 px-3 py-1 text-xs font-bold text-emerald-300">
                ✓ Completed
              </span>
            )}
          </div>

          <h2 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
            {exercise.title}
          </h2>
        </div>

        <div className="px-4 py-5 sm:px-6">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.15em] text-slate-400">
            Challenge
          </p>

          <div className="whitespace-pre-wrap text-[15px] leading-7 text-slate-300">
            {exercise.prompt}
          </div>
          {isCode && (
            <a href="#code-editor" className="btn-secondary mt-4">
              Jump to editor ↓
            </a>
          )}
        </div>
      </article>

      {/* ===============================================
          CODE WORKSPACE
      =============================================== */}

      {isCode && (
        <section className="overflow-hidden rounded-3xl border border-slate-700 bg-[#050914]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/50 px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
              </div>

              <span className="border-l border-slate-700 pl-3 text-xs font-bold text-slate-300">
                Main.java
              </span>
            </div>

            <span className="rounded-md bg-slate-950 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Java 21
            </span>
          </div>

          <textarea
            id="code-editor"
            aria-label="Java source code"
            disabled={busy}
            autoCapitalize="off"
            autoCorrect="off"
            wrap="off"
            spellCheck={false}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="min-h-[320px] sm:min-h-[390px] w-full resize-y bg-transparent p-5 font-mono text-sm leading-7 text-slate-100 outline-none sm:p-6"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-900 px-5 py-4">
            <p className="text-xs text-slate-400">
              Run your solution against the challenge tests.
            </p>

            <div className="flex flex-wrap gap-2">
              {(passed || completed) && (
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={busy}
                  onClick={onNext}
                >
                  Continue →
                </button>
              )}

              <button
                type="button"
                className="btn-primary min-w-36"
                disabled={busy || !code.trim()}
                onClick={onRun}
              >
                {busy ? "Running tests…" : "Run & submit"}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ===============================================
          OUTPUT PREDICTION
      =============================================== */}

      {isPrediction && (
        <NonCodeAnswer
          answer={answer}
          setAnswer={setAnswer}
          busy={busy}
          completed={completed}
          answerCorrect={answerCorrect}
          multiline
          label="What will the program output?"
          placeholder="Type the exact output..."
          onRun={onRun}
          onNext={onNext}
        />
      )}

      {/* ===============================================
          MULTIPLE CHOICE
      =============================================== */}

      {isMultipleChoice && (
        <NonCodeAnswer
          answer={answer}
          setAnswer={setAnswer}
          busy={busy}
          completed={completed}
          answerCorrect={answerCorrect}
          label="Your answer"
          placeholder="Enter the correct option..."
          onRun={onRun}
          onNext={onNext}
        />
      )}

      {/* ===============================================
          ERROR
      =============================================== */}

      {error && (
        <div
          aria-live="polite"
          className="rounded-2xl border border-red-900/80 bg-red-950/20 px-5 py-4"
        >
          <div className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-950 text-sm font-black text-red-300">
              !
            </span>

            <div>
              <p className="font-bold text-red-300">Not quite yet</p>

              <p className="mt-1 text-sm leading-6 text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* ===============================================
          CODE RESULT
      =============================================== */}

      {result && <ResultPanel result={result} />}
    </div>
  );
}

// =====================================================
// NON-CODE ANSWER
// =====================================================

export function NonCodeAnswer({
  answer,
  setAnswer,
  busy,
  completed,
  answerCorrect,
  multiline = false,
  label,
  placeholder,
  onRun,
  onNext,
}: {
  answer: string;
  setAnswer: (value: string) => void;
  busy: boolean;
  completed: boolean;
  answerCorrect: boolean;
  multiline?: boolean;
  label: string;
  placeholder: string;
  onRun: () => void;
  onNext: () => void;
}) {
  const solved = completed || answerCorrect;

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60">
      {!solved ? (
        <>
          <div className="border-b border-slate-800 px-6 py-4 sm:px-8">
            <p className="text-sm font-bold text-slate-200">{label}</p>

            <p className="mt-1 text-xs text-slate-400">
              Enter your answer exactly as Java would produce it.
            </p>
          </div>

          <div className="px-6 py-6 sm:px-8">
            {multiline ? (
              <textarea
                id="exercise-answer"
                aria-label={label}
                rows={3}
                value={answer}
                disabled={busy}
                autoComplete="off"
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    if (answer.trim() && !busy) onRun();
                  }
                }}
                placeholder={placeholder}
                className="min-h-24 w-full resize-y rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 font-mono text-sm text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10"
              />
            ) : (
              <input
                id="exercise-answer"
                aria-label={label}
                type="text"
                value={answer}
                disabled={busy}
                autoComplete="off"
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && answer.trim() && !busy) {
                    onRun();
                  }
                }}
                placeholder={placeholder}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 font-mono text-sm text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10"
              />
            )}

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="btn-primary min-w-36"
                disabled={busy || !answer.trim()}
                onClick={onRun}
              >
                {busy ? "Checking…" : "Check answer →"}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-5 rounded-2xl border border-emerald-800/70 bg-emerald-950/20 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-950 text-lg font-black text-emerald-300">
                ✓
              </span>

              <div>
                <p className="font-black text-emerald-300">Correct answer</p>

                <p className="mt-1 text-sm text-emerald-200">
                  Nice work. This exercise is complete.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary shrink-0"
              onClick={onNext}
            >
              Continue →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// =====================================================
// RESULT PANEL
// =====================================================

function ResultPanel({ result }: { result: SubmissionResultDto }) {
  const passed = result.status === "PASSED";

  const passedTests = result.tests.filter((test) => test.passed).length;

  return (
    <section
      aria-live="polite"
      className={`overflow-hidden rounded-3xl border ${
        passed
          ? "border-emerald-800/80 bg-emerald-950/10"
          : "border-red-900/80 bg-red-950/10"
      }`}
    >
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full font-black ${
              passed
                ? "bg-emerald-950 text-emerald-300"
                : "bg-red-950 text-red-300"
            }`}
          >
            {passed ? "✓" : "!"}
          </span>

          <div>
            <p
              className={`font-black ${
                passed ? "text-emerald-300" : "text-red-300"
              }`}
            >
              {passed ? "All tests passed" : "Keep iterating"}
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              {passedTests}/{result.tests.length} tests passed ·{" "}
              {result.runtimeMs ?? 0} ms
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-slate-300">
            Score {result.score}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-black ${
              passed
                ? "bg-emerald-950 text-emerald-300"
                : "bg-red-950 text-red-300"
            }`}
          >
            {result.status}
          </span>
        </div>
      </header>

      <div className="p-4 sm:p-5">
        {result.errorText && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-black uppercase tracking-wider text-red-400">
              Error
            </p>

            <pre
              tabIndex={0}
              className="max-h-80 overflow-auto rounded-xl border border-red-950 bg-slate-950 p-4 text-sm leading-6 text-red-200"
            >
              {result.errorText}
            </pre>
          </div>
        )}

        <div className="grid gap-2">
          {result.tests.map((test) => (
            <div
              key={test.position}
              className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/50"
            >
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      test.passed ? "bg-emerald-400" : "bg-red-400"
                    }`}
                  />

                  <span className="text-sm font-semibold text-slate-300">
                    {test.hidden ? "Hidden test" : `Test ${test.position}`}
                  </span>
                </div>

                <span
                  className={`text-xs font-bold ${
                    test.passed ? "text-emerald-300" : "text-red-300"
                  }`}
                >
                  {test.passed ? "Passed" : "Failed"}
                </span>
              </div>

              {!test.hidden &&
                !test.passed &&
                (test.expectedOutput !== null || test.stdout !== null) && (
                  <div className="grid gap-px border-t border-slate-800 bg-slate-800 md:grid-cols-2">
                    {test.expectedOutput !== null && (
                      <div className="bg-slate-950 p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                          Expected
                        </p>

                        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-sm leading-6 text-emerald-200">
                          {test.expectedOutput}
                        </pre>
                      </div>
                    )}

                    {test.stdout !== null && (
                      <div className="bg-slate-950 p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                          Your output
                        </p>

                        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-sm leading-6 text-slate-200">
                          {test.stdout || "(no output)"}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================
// EMPTY STATE
// =====================================================

function EmptyQuest() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-xl">
        ◇
      </div>

      <h2 className="mt-4 text-lg font-black text-slate-200">
        Nothing here yet
      </h2>

      <p className="mt-2 text-sm text-slate-400">
        This quest does not have any learning content yet.
      </p>
    </div>
  );
}
