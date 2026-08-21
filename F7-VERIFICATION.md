# Foundation 7 Verification

Run `pnpm install`, `pnpm db:generate`, `pnpm db:push`, `pnpm db:seed`, then `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.

Acceptance journey:

1. Log in at `/login` as the development admin and open `/admin`.
2. Create a draft course and confirm it is absent from learner `GET /courses`.
3. Add a module, quest, lesson, and Java exercise with public and hidden tests.
4. Preview the unpublished quest as admin.
5. Attempt to publish invalid content and verify a 422 validation response.
6. Publish the valid quest, then the course.
7. Log in as a learner, enroll, and solve the published exercise.
8. Confirm the learner quest response contains starter code but no solution, test inputs, hidden flags, or expected outputs.
9. Archive the course and confirm it disappears from learner APIs.
10. Review `/admin/audit` and confirm all authoring lifecycle events name the responsible administrator.

Database-backed integration tests require PostgreSQL. Java execution additionally requires the local runner image.
