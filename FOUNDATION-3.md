# Foundation 3 — Java Code Execution Engine

## Added
- Authenticated Java code submission endpoint.
- Persistent `Submission` lifecycle: PENDING → PASSED / FAILED / ERROR.
- Docker-isolated Java 21 runner with network disabled and resource/output/time limits.
- Public + hidden test execution without leaking hidden stdout/expected output.
- Passing CODE submissions are the only path that can complete CODE exercises.
- Shared submission DTOs, Zod request validation, frontend submission client.
- Security-boundary integration tests and runner ADR.

## Endpoint
`POST /quests/:questSlug/exercises/:exerciseSlug/submissions`

Body:
```json
{ "sourceCode": "public class Main { ... }" }
```

The learner must already be enrolled in the course.
