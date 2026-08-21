import { prisma } from "@javaquets/database";
import type { EnrollmentDto } from "@javaquets/shared";
import { NotFoundError } from "../../common/errors/AppError.js";

export async function enrollInCourse(userId: string, courseSlug: string): Promise<EnrollmentDto> {
  const course = await prisma.course.findFirst({
    where: { slug: courseSlug, status: "PUBLISHED" },
    select: { id: true, slug: true, title: true },
  });
  if (!course) throw new NotFoundError("COURSE_NOT_FOUND", "Course not found");

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: course.id } },
  });
  const enrollment = existing ?? await prisma.enrollment.create({ data: { userId, courseId: course.id } });

  return {
    courseSlug: course.slug,
    courseTitle: course.title,
    status: enrollment.status,
    enrolledAt: enrollment.enrolledAt.toISOString(),
    completedAt: enrollment.completedAt?.toISOString() ?? null,
  };
}

export async function listEnrollments(userId: string): Promise<EnrollmentDto[]> {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    orderBy: { enrolledAt: "asc" },
    include: { course: { select: { slug: true, title: true } } },
  });

  return enrollments.map((item) => ({
    courseSlug: item.course.slug,
    courseTitle: item.course.title,
    status: item.status,
    enrolledAt: item.enrolledAt.toISOString(),
    completedAt: item.completedAt?.toISOString() ?? null,
  }));
}
