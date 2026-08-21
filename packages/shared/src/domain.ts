export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type CourseStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type QuestStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type LessonKind = "THEORY" | "EXAMPLE" | "RECAP";
export type ExerciseKind = "MULTIPLE_CHOICE" | "CODE" | "OUTPUT_PREDICTION";
export type ProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export type QuestSummary = {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  position: number;
  estimatedMinutes: number;
};

export type CourseModuleSummary = {
  slug: string;
  title: string;
  description: string | null;
  position: number;
  quests: QuestSummary[];
};

export type CourseSummary = {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  moduleCount: number;
  questCount: number;
};

export type CourseDetail = {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  modules: CourseModuleSummary[];
};

export type LessonDto = {
  slug: string;
  title: string;
  kind: LessonKind;
  content: string;
  position: number;
};

export type ExerciseDto = {
  slug: string;
  title: string;
  prompt: string;
  kind: ExerciseKind;
  difficulty: Difficulty;
  position: number;
  starterCode: string | null;
};

export type QuestDetail = QuestSummary & {
  module: {
    slug: string;
    title: string;
    courseSlug: string;
  };
  lessons: LessonDto[];
  exercises: ExerciseDto[];
};
