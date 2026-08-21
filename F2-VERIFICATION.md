# Foundation 2 verification

Run from repository root after Foundation 0/1 prerequisites pass.

```bash
pnpm install
cp .env.example .env
docker compose -f infra/docker/docker-compose.yml up -d
pnpm db:generate
pnpm db:push
pnpm db:seed
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm dev
```

## Learner journey smoke test

```bash
USER_HEADER='x-javaquets-user-id: demo-learner'

curl -i -X POST -H "$USER_HEADER" http://localhost:4000/courses/java-foundations/enroll
curl -i -X POST -H "$USER_HEADER" http://localhost:4000/quests/hello-java/start
curl -i -X POST -H "$USER_HEADER" http://localhost:4000/quests/hello-java/exercises/print-javaquets/complete
curl -i -H "$USER_HEADER" http://localhost:4000/me/quests/hello-java/progress
curl -i -H "$USER_HEADER" http://localhost:4000/me/courses/java-foundations/progress
```

Expected after completing `print-javaquets`: `hello-java` is `COMPLETED`. The course remains incomplete because `variables-and-types` still has an unfinished exercise.

## Negative checks

Without the identity header, learner endpoints must return HTTP 401 with `AUTH_REQUIRED`.

Starting a quest before enrolling must return HTTP 409 with `COURSE_ENROLLMENT_REQUIRED`.

The completion route must remain nested under a quest because exercise slugs are only unique within their quest.
