# Foundation 1 Architecture

Foundation 1 establishes the first product-domain boundary without introducing identity or execution infrastructure.

## Read path

`Next.js -> Express -> course/quest service -> Prisma -> PostgreSQL`

Shared response DTOs live in `@javaquets/shared`; route parameter schemas live in `@javaquets/validation`.

## Curriculum graph

`Course -> CourseModule -> Quest -> Lesson`

`Quest -> Exercise -> TestCase`

Explicit `position` fields define curriculum order. Published discovery queries filter on publication status at the server, rather than trusting the client to hide drafts.

## Learner graph

`User -> Submission -> Exercise`

`User -> QuestProgress -> Quest`

`Submission` stores attempts. `QuestProgress` stores the materialized quest-level progress state. Foundation 1 defines these persistence contracts but does not expose learner-write endpoints because authenticated identity is not yet present.

## Security boundary

The public `QuestDetail` DTO includes prompts and optional starter code. It excludes exercise solutions and all test-case data. Future execution services may read hidden tests server-side, but browsers must not receive them.
