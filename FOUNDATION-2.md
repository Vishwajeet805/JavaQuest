# Foundation 2 — Learner Identity, Enrollment & Progress

Foundation 2 turns the read-only curriculum from Foundation 1 into a learner-state system.

## Scope

- trusted local learner identity boundary via `x-javaquets-user-id`
- course enrollments
- quest start state
- persisted exercise completion state
- automatic quest completion when all quest exercises are complete
- automatic enrollment completion when all published course quests are complete
- learner-facing progress DTOs and APIs
- deterministic demo learner (`demo-learner`)
- end-to-end learner journey integration test

## Important boundary

The identity header is deliberately a development boundary, not production authentication. A later authentication phase must replace it with a verified session/token provider. The progress transition endpoint is also intentionally separate from code evaluation; the Java execution engine will become the authority that marks code exercises complete.

## API

All learner endpoints require:

`x-javaquets-user-id: demo-learner`

Endpoints:

- `POST /courses/:slug/enroll`
- `GET /me/enrollments`
- `POST /quests/:slug/start`
- `POST /quests/:questSlug/exercises/:exerciseSlug/complete`
- `GET /me/quests/:slug/progress`
- `GET /me/courses/:slug/progress`
