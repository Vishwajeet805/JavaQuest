import type { ProgressStatus } from "./domain.js";

export type EnrollmentStatus = "ACTIVE" | "COMPLETED";

export type EnrollmentDto = {
  courseSlug: string;
  courseTitle: string;
  status: EnrollmentStatus;
  enrolledAt: string;
  completedAt: string | null;
};

export type QuestProgressDto = {
  questSlug: string;
  status: ProgressStatus;
  completedExercises: number;
  totalExercises: number;
  completedExerciseSlugs: string[];
  startedAt: string | null;
  completedAt: string | null;
};

export type CourseProgressDto = {
  courseSlug: string;
  enrollmentStatus: EnrollmentStatus;
  completedQuests: number;
  totalQuests: number;
  percentComplete: number;
  quests: Array<{ questSlug: string; status: ProgressStatus }>;
};
