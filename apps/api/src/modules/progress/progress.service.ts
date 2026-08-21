import { prisma } from "@javaquets/database";
import type { CourseProgressDto, QuestProgressDto } from "@javaquets/shared";
import { AppError, NotFoundError } from "../../common/errors/AppError.js";
import { awardXp } from "../gamification/gamification.service.js";

async function getQuestForLearner(userId: string, questSlug: string) {
  const quest = await prisma.quest.findFirst({
    where: { slug: questSlug, status: "PUBLISHED", module: { course: { status: "PUBLISHED" } } },
    include: { module: { include: { course: true } }, exercises: { orderBy: { position: "asc" } } },
  });
  if (!quest) throw new NotFoundError("QUEST_NOT_FOUND", "Quest not found");
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: quest.module.course.id } },
  });
  if (!enrollment) throw new AppError("COURSE_ENROLLMENT_REQUIRED", "Enroll in the course before starting this quest", 409);
  return quest;
}

export async function startQuest(userId: string, questSlug: string): Promise<QuestProgressDto> {
  const quest = await getQuestForLearner(userId, questSlug);
  const existing = await prisma.questProgress.findUnique({
    where: { userId_questId: { userId, questId: quest.id } },
  });
  if (existing?.status === "COMPLETED") return getQuestProgress(userId, questSlug);
  await prisma.questProgress.upsert({
    where: { userId_questId: { userId, questId: quest.id } },
    update: { status: "IN_PROGRESS", totalExercises: quest.exercises.length, completedAt: null },
    create: { userId, questId: quest.id, status: "IN_PROGRESS", startedAt: new Date(), totalExercises: quest.exercises.length },
  });
  return getQuestProgress(userId, questSlug);
}

export async function completeExercise(userId: string, questSlug: string, exerciseSlug: string, options: { evaluatorVerified?: boolean } = {}): Promise<QuestProgressDto> {
  const exercise = await prisma.exercise.findFirst({
    where: { slug: exerciseSlug, quest: { slug: questSlug, status: "PUBLISHED", module: { course: { status: "PUBLISHED" } } } },
    include: { quest: { include: { module: { include: { course: true } }, exercises: true } } },
  });
  if (!exercise) throw new NotFoundError("EXERCISE_NOT_FOUND", "Exercise not found");
  if (exercise.kind === "CODE" && !options.evaluatorVerified) throw new AppError("CODE_EVALUATION_REQUIRED", "Code exercises can only be completed by a passing evaluator submission", 409);

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: exercise.quest.module.course.id } },
  });
  if (!enrollment) throw new AppError("COURSE_ENROLLMENT_REQUIRED", "Enroll in the course before completing exercises", 409);

  const now = new Date();
  await prisma.exerciseProgress.upsert({
    where: { userId_exerciseId: { userId, exerciseId: exercise.id } },
    update: { status: "COMPLETED", completedAt: now },
    create: { userId, exerciseId: exercise.id, status: "COMPLETED", startedAt: now, completedAt: now },
  });

  const completedExercises = await prisma.exerciseProgress.count({
    where: { userId, exercise: { questId: exercise.questId }, status: "COMPLETED" },
  });
  const totalExercises = exercise.quest.exercises.length;
  const completed = totalExercises === 0 || completedExercises >= totalExercises;

  await prisma.questProgress.upsert({
    where: { userId_questId: { userId, questId: exercise.questId } },
    update: {
      status: completed ? "COMPLETED" : "IN_PROGRESS",
      completedExercises,
      totalExercises,
      completedAt: completed ? now : null,
    },
    create: {
      userId,
      questId: exercise.questId,
      status: completed ? "COMPLETED" : "IN_PROGRESS",
      completedExercises,
      totalExercises,
      startedAt: now,
      completedAt: completed ? now : null,
    },
  });

  await recomputeEnrollment(userId, exercise.quest.module.course.id);
  await awardXp(userId, { amount: 25, reason: `Completed ${exercise.title}`, sourceType: "EXERCISE", sourceId: exercise.id });
  if (completed) await awardXp(userId, { amount: 100, reason: `Completed ${exercise.quest.title}`, sourceType: "QUEST", sourceId: exercise.questId });
  const updatedEnrollment = await prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId: exercise.quest.module.course.id } } });
  if (updatedEnrollment?.status === "COMPLETED") await awardXp(userId, { amount: 250, reason: `Completed ${exercise.quest.module.course.title}`, sourceType: "COURSE", sourceId: exercise.quest.module.course.id });
  return getQuestProgress(userId, exercise.quest.slug);
}

async function recomputeEnrollment(userId: string, courseId: string) {
  const totalQuests = await prisma.quest.count({ where: { module: { courseId }, status: "PUBLISHED" } });
  const completedQuests = await prisma.questProgress.count({
    where: { userId, quest: { module: { courseId }, status: "PUBLISHED" }, status: "COMPLETED" },
  });
  if (totalQuests > 0 && completedQuests >= totalQuests) {
    await prisma.enrollment.update({
      where: { userId_courseId: { userId, courseId } },
      data: { status: "COMPLETED", completedAt: new Date() },
    });
  }
}

export async function getQuestProgress(userId: string, questSlug: string): Promise<QuestProgressDto> {
  const quest = await getQuestForLearner(userId, questSlug);
  const progress = await prisma.questProgress.findUnique({
    where: { userId_questId: { userId, questId: quest.id } },
  });
  const completed = await prisma.exerciseProgress.findMany({
    where: { userId, exercise: { questId: quest.id }, status: "COMPLETED" },
    select: { exercise: { select: { slug: true } } },
  });
  return {
    questSlug: quest.slug,
    status: progress?.status ?? "NOT_STARTED",
    completedExercises: progress?.completedExercises ?? completed.length,
    totalExercises: quest.exercises.length,
    completedExerciseSlugs: completed.map((item) => item.exercise.slug),
    startedAt: progress?.startedAt?.toISOString() ?? null,
    completedAt: progress?.completedAt?.toISOString() ?? null,
  };
}

export async function getCourseProgress(userId: string, courseSlug: string): Promise<CourseProgressDto> {
  const course = await prisma.course.findFirst({
    where: { slug: courseSlug, status: "PUBLISHED" },
    include: { modules: { include: { quests: { where: { status: "PUBLISHED" }, orderBy: { position: "asc" } } }, orderBy: { position: "asc" } } },
  });
  if (!course) throw new NotFoundError("COURSE_NOT_FOUND", "Course not found");
  const enrollment = await prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId: course.id } } });
  if (!enrollment) throw new AppError("COURSE_ENROLLMENT_REQUIRED", "Learner is not enrolled in this course", 409);

  const questIds = course.modules.flatMap((m) => m.quests.map((q) => q.id));
  const progress = await prisma.questProgress.findMany({ where: { userId, questId: { in: questIds } } });
  const byQuest = new Map(progress.map((p) => [p.questId, p]));
  const quests = course.modules.flatMap((module) => module.quests.map((quest) => ({
    questSlug: quest.slug,
    status: byQuest.get(quest.id)?.status ?? "NOT_STARTED",
  })));
  const completedQuests = quests.filter((q) => q.status === "COMPLETED").length;
  return {
    courseSlug: course.slug,
    enrollmentStatus: enrollment.status,
    completedQuests,
    totalQuests: quests.length,
    percentComplete: quests.length === 0 ? 0 : Math.round((completedQuests / quests.length) * 100),
    quests,
  };
}
