CREATE TYPE "ProgrammingLanguage" AS ENUM ('JAVA', 'PYTHON');
ALTER TABLE "Course" ADD COLUMN "language" "ProgrammingLanguage" NOT NULL DEFAULT 'JAVA';
