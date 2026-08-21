# Architecture overview

## Why a monorepo

Courses, quests, exercises, code execution, progress, XP, achievements,
profiles, and admin tooling will all be built on this foundation. Keeping
them in separate `apps/*` and `packages/*` boundaries from day one prevents
them from becoming a single tangled codebase later.

## Layers

- `apps/web` — presentation layer only. Talks to `apps/api` over HTTP,
  never touches the database directly.
- `apps/api` — business logic, organized as one module per business
  capability under `src/modules/`.
- `packages/database` — the only place Prisma is imported. Nothing outside
  this package (and `apps/api`, via the package) talks to Postgres directly.
- `packages/shared` / `packages/validation` — the contract layer between
  frontend and backend, so both sides agree on shapes without duplicating
  type definitions.
- `packages/config` — the only place `process.env` is read directly;
  everything else imports the validated `env` object.

## Request flow

```text
Browser
   ↓
Next.js (apps/web)
   ↓  fetch()
JavaQuets API (apps/api)
   ↓
modules/<name>/*.service.ts
   ↓
packages/database (Prisma)
   ↓
PostgreSQL
```

## Error flow

Every thrown `AppError` (or subclass) is caught by the central
`errorHandler` middleware and serialized into the standard error shape:

```json
{
  "error": {
    "code": "QUEST_NOT_FOUND",
    "message": "Quest not found",
    "details": null
  }
}
```

This lets the frontend branch on `error.code` instead of parsing message
strings.
