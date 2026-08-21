# Foundation 1 Verification

Foundation 1 is complete when the domain schema can be generated/pushed, seed data loads, and public learning APIs return only safe published curriculum fields.

## Run

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

## API checks

```bash
curl http://localhost:4000/courses
curl http://localhost:4000/courses/java-foundations
curl http://localhost:4000/quests/hello-java
```

Expected:
- `/courses` contains `Java Foundations`.
- Course detail contains ordered modules and published quests.
- Quest detail contains ordered lessons and exercises.
- Quest response contains `starterCode` where applicable.
- Quest response MUST NOT contain `solution`, test cases, or hidden expected output.
- Unknown course/quest slugs return HTTP 404 with `COURSE_NOT_FOUND` / `QUEST_NOT_FOUND`.
- Invalid slug syntax returns HTTP 400 with `VALIDATION_ERROR`.

## Data checks

Open Prisma Studio if useful:

```bash
pnpm --filter @javaquets/database db:studio
```

Verify unique ordering constraints and cascading content relationships. Do not create user progress yet; that becomes meaningful once authentication/user identity is introduced.
