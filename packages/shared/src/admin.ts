import type { CourseStatus, Difficulty, ExerciseKind, LessonKind, QuestStatus } from "./domain.js";
export type AdminTestCaseDto = { id: string; position: number; input: string | null; expectedOutput: string; isHidden: boolean };
export type AdminExerciseDto = { id: string; slug: string; title: string; prompt: string; kind: ExerciseKind; difficulty: Difficulty; position: number; starterCode: string | null; solution: string | null; executionTimeoutMs: number; testCases: AdminTestCaseDto[] };
export type AdminLessonDto = { id: string; slug: string; title: string; kind: LessonKind; content: string; position: number };
export type AdminQuestDto = { id: string; moduleId: string; slug: string; title: string; description: string; status: QuestStatus; difficulty: Difficulty; position: number; estimatedMinutes: number; version: number; publishedAt: string | null; lessons: AdminLessonDto[]; exercises: AdminExerciseDto[] };
export type AdminModuleDto = { id: string; courseId: string; slug: string; title: string; description: string | null; position: number; quests: AdminQuestDto[] };
export type AdminCourseDto = { id: string; slug: string; title: string; description: string; status: CourseStatus; difficulty: Difficulty; version: number; publishedAt: string | null; modules: AdminModuleDto[] };
export type ContentAuditEventDto = { id: string; action: string; entityType: string; entityId: string; entitySlug: string | null; adminEmail: string; metadata: unknown; createdAt: string };
