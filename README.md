# JavaQuets

A Java-learning platform delivered through courses, quests, and exercises.

This repository currently contains **Foundation 0** — the base architecture the
rest of the product (courses, quests, exercises, code execution, progress, XP,
achievements, profiles, admin panel, etc.) will be built on top of. No product
features live here yet; the goal of this stage is a clean, boring, provably
working skeleton.

## Structure

```text
javaquets/
├── apps/
│   ├── web/                 # Next.js frontend
│   └── api/                 # Express backend
│
├── packages/
│   ├── database/            # Prisma schema/client
│   ├── shared/               # Shared TS types/constants
│   ├── validation/           # Request/domain schemas (zod)
│   ├── config/                # Central env validation
│   └── ui/                   # Reusable UI components (populated later)
│
├── docs/
│   ├── architecture/
│   └── decisions/
│
├── infra/
│   └── docker/               # Local Postgres via docker-compose
│
└── .github/workflows/        # CI pipeline
```

## Getting started

```bash
# 1. Install dependencies
pnpm install

# 2. Copy env file
cp .env.example .env

# 3. Start local Postgres
docker compose -f infra/docker/docker-compose.yml up -d

# 4. Generate Prisma client and push schema
pnpm db:generate
pnpm db:push

# 5. Run everything
pnpm dev
```

This should give you:

- Web: http://localhost:3000
- API: http://localhost:4000
- Postgres: localhost:5432

Visiting the web app should show:

```text
API Status: Connected ✓
Database Status: Connected ✓
```

And hitting the API directly:

```bash
curl http://localhost:4000/health
```

```json
{
  "status": "ok",
  "service": "javaquets-api",
  "database": "connected"
}
```

That end-to-end request is the Foundation 0 checkpoint — it proves the
frontend, backend, and database are all correctly wired together.

## Quality gates

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

All four must pass before merging.

## Architecture rules

- **One business capability = one module** in `apps/api/src/modules/*`
  (controller + service + repository + schema + types + routes per module),
  not global `controllers/`, `services/`, `repositories/` dumping grounds.
- **`components/` vs `features/`** in the frontend: `components/` holds
  generic, reusable UI; `features/` holds business-domain UI
  (`features/quests`, `features/courses`, etc.).
- **Shared contracts**: types live in `packages/shared`, request/response
  validation lives in `packages/validation`, so the frontend and backend never
  drift apart on shape.
- **No scattered `process.env`**: all environment access goes through the
  validated `env` object in `packages/config`.
- **Standard error shape** everywhere:

  ```json
  {
    "error": {
      "code": "QUEST_NOT_FOUND",
      "message": "Quest not found",
      "details": null
    }
  }
  ```

## What comes next — Foundation 1

Foundation 1 introduces the actual domain model and turns this into a real
Java-learning product:

```text
User
Course
Module
Quest
Lesson
Exercise
Submission
Progress
```
