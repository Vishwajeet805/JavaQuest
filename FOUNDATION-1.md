# Foundation 1 — Learning Domain Baseline

Implemented:

- Curriculum schema: Course, CourseModule, Quest, Lesson, Exercise, TestCase
- Learner-state schema: Submission, QuestProgress
- Publication, difficulty, exercise, lesson, submission, and progress enums
- Ordered content constraints and relationship indexes
- Shared public DTO contracts
- Slug validation contract
- Read-only published curriculum APIs
- Public response boundary that excludes solutions and test cases
- Deterministic Java Foundations seed curriculum
- Integration tests for course/quest discovery and data-leak protection
- Frontend course/quest API clients
- Foundation 1 ADR, architecture note, and verification checklist

Deferred intentionally:

- Authentication and authorization
- Enrollment
- User progress write endpoints
- Java execution/sandbox service
- Scoring policy
- XP, streaks, achievements, leaderboard
- Prerequisite/unlock engine
- Admin/content-authoring APIs

Runtime verification still requires a networked machine because this build environment cannot fetch pnpm/packages from npm registry.
