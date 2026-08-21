import { prisma } from "@javaquets/database";
import type { QuestDetail } from "@javaquets/shared";
import { NotFoundError } from "../../common/errors/AppError.js";

export async function getPublishedQuest(slug: string): Promise<QuestDetail> {
  const quest = await prisma.quest.findFirst({
    where: { slug, status: "PUBLISHED", module: { course: { status: "PUBLISHED" } } },
    include: {
      module: { include: { course: true } },
      lessons: { orderBy: { position: "asc" } },
      exercises: { orderBy: { position: "asc" } },
    },
  });

  if (!quest) {
    throw new NotFoundError("QUEST_NOT_FOUND", "Quest not found");
  }

  return {
    slug: quest.slug,
    title: quest.title,
    description: quest.description,
    difficulty: quest.difficulty,
    position: quest.position,
    estimatedMinutes: quest.estimatedMinutes,
    module: {
      slug: quest.module.slug,
      title: quest.module.title,
      courseSlug: quest.module.course.slug,
    },
    lessons: quest.lessons.map((lesson) => ({
      slug: lesson.slug,
      title: lesson.title,
      kind: lesson.kind,
      content: lesson.content,
      position: lesson.position,
    })),
    exercises: quest.exercises.map((exercise) => ({
      slug: exercise.slug,
      title: exercise.title,
      prompt: exercise.prompt,
      kind: exercise.kind,
      difficulty: exercise.difficulty,
      position: exercise.position,
      starterCode: exercise.starterCode,
    })),
  };
}
