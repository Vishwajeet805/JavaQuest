# ADR 0001 — Foundation 0 stack choices

**Status:** Accepted

## Context

JavaQuets needs a base architecture before any product feature (courses,
quests, exercises, code execution, progress, XP, achievements) is built, so
that those features don't end up tangled together.

## Decisions

- **Monorepo**: pnpm workspaces + Turborepo, so `apps/*` and `packages/*`
  share tooling and caching without being one giant app.
- **Frontend**: Next.js (App Router) + TypeScript + Tailwind, for a modern
  React foundation with good defaults.
- **Backend**: Express + TypeScript, organized as one module per business
  capability (`modules/<name>/{controller,service,repository,schema,types,routes}`)
  rather than global `controllers/`/`services/`/`repositories/` folders.
- **Database**: PostgreSQL via Prisma, since JavaQuets' domain (users,
  courses, modules, quests, exercises, submissions, progress) is naturally
  relational.
- **Env validation**: zod-validated env object in `packages/config`, so
  invalid/missing env vars fail fast at boot instead of causing silent bugs.
- **Errors**: a single `AppError` class with `code` / `statusCode` /
  `details`, serialized to a standard JSON error shape by one central
  middleware.
- **Logging**: structured JSON logs (pino) with request IDs and durations,
  not raw `console.log`.
- **Local dev DB**: Postgres via `docker compose`, so no one needs to
  install Postgres manually.
- **CI**: GitHub Actions running lint → typecheck → test → build on every
  push/PR.

## Consequences

- Slightly more setup than a single `create-next-app` before any feature
  code is written.
- Every future feature module follows the same shape, which keeps the
  codebase predictable as it grows (courses, quests, exercises, progress,
  achievements, leaderboard, admin, etc.).
