import { prisma } from "@javaquets/database";
import type { CourseDetail, CourseSummary } from "@javaquets/shared";
import { NotFoundError } from "../../common/errors/AppError.js";

export async function listPublishedCourses(): Promise<CourseSummary[]> {
  const courses = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "asc" },
    include: {
      modules: {
        include: {
          _count: { select: { quests: { where: { status: "PUBLISHED" } } } },
        },
      },
    },
  });

  return courses.map((course) => ({
    slug: course.slug,
    title: course.title,
    description: course.description,
    difficulty: course.difficulty,
    moduleCount: course.modules.length,
    questCount: course.modules.reduce((sum, module) => sum + module._count.quests, 0),
  }));
}

export async function getPublishedCourse(slug: string): Promise<CourseDetail> {
  const course = await prisma.course.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      modules: {
        orderBy: { position: "asc" },
        include: {
          quests: {
            where: { status: "PUBLISHED" },
            orderBy: { position: "asc" },
          },
        },
      },
    },
  });

  if (!course) {
    throw new NotFoundError("COURSE_NOT_FOUND", "Course not found");
  }

  return {
    slug: course.slug,
    title: course.title,
    description: course.description,
    difficulty: course.difficulty,
    modules: course.modules.map((module) => ({
      slug: module.slug,
      title: module.title,
      description: module.description,
      position: module.position,
      quests: module.quests.map((quest) => ({
        slug: quest.slug,
        title: quest.title,
        description: quest.description,
        difficulty: quest.difficulty,
        position: quest.position,
        estimatedMinutes: quest.estimatedMinutes,
      })),
    })),
  };
}
