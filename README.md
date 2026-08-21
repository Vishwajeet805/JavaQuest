# JavaQuets

JavaQuets Foundation 1 monorepo: verified-oriented infrastructure from Foundation 0 plus the first stable learning-domain layer.

## Stack

- pnpm workspaces + Turborepo
- Next.js web app
- Express API
- PostgreSQL 17 + Prisma
- Zod validation
- Pino structured logging
- Vitest + Supertest integration testing

## Foundation 1 domain

Curriculum:

`Course -> CourseModule -> Quest -> Lesson / Exercise -> TestCase`

Learner state:

`User -> Submission`

`User -> QuestProgress`

Foundation 1 exposes read-only published curriculum through:

- `GET /courses`
- `GET /courses/:slug`
- `GET /quests/:slug`

Solutions and test cases are intentionally not included in public quest responses.

## Requirements

- Node.js 20+
- pnpm 10
- Docker / Docker Compose

## Local setup

```bash
pnpm install
cp .env.example .env
docker compose -f infra/docker/docker-compose.yml up -d
pnpm db:generate
pnpm db:push
pnpm db:seed
pnpm dev
```

Then open:

- Web: http://localhost:3000
- API health: http://localhost:4000/health
- Courses: http://localhost:4000/courses
- Seeded course: http://localhost:4000/courses/java-foundations
- Seeded quest: http://localhost:4000/quests/hello-java

## Quality checks

With PostgreSQL running:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

See `F0.4-VERIFICATION.md` for Foundation 0 checks and `F1-VERIFICATION.md` for Foundation 1 acceptance checks.

## Lockfile note

This archive was assembled in an environment without registry access, so a real `pnpm-lock.yaml` could not be generated. The first networked `pnpm install` should generate it; commit that file, then change CI from `pnpm install --no-frozen-lockfile` to `pnpm install --frozen-lockfile` for reproducible installs.
