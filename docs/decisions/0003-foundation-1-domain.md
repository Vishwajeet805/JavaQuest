# ADR 0003 — Foundation 1 Learning Domain

## Status
Accepted for Foundation 1.

## Decision
JavaQuets models curriculum as an ordered hierarchy:

`Course -> CourseModule -> Quest -> Lesson / Exercise -> TestCase`

Learner runtime state is modeled separately:

`User -> Submission`

`User -> QuestProgress`

## Why
Curriculum content and learner state have different lifecycles. Keeping them separate avoids coupling authoring changes to user progress and gives the future code-execution service a stable `Exercise`/`TestCase` contract.

## Important invariants
- Public discovery APIs expose only `PUBLISHED` courses and quests.
- Ordering is explicit via `position`; clients must not infer order from IDs or creation timestamps.
- Quest slugs are globally unique because `/quests/:slug` is a global route.
- Module slugs are unique only inside a course.
- Lesson and exercise slugs are unique inside a quest.
- Hidden test cases and exercise solutions are database-side data and are never returned by Foundation 1 public read APIs.
- `QuestProgress` is one row per user/quest.
- Submissions are append-only attempt records; they are not the source of truth for curriculum content.

## Deferred
Authentication/authorization, enrollment, code execution, scoring policy, XP/streaks, achievements, prerequisites/unlocking, authoring/admin APIs, and versioned curriculum publishing are deliberately deferred.
