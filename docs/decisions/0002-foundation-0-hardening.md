# ADR 0002 — Foundation 0 hardening

## Status
Accepted

## Context
The initial Foundation 0 skeleton established the monorepo shape but had several bootstrap gaps: CI expected a lockfile that was not present, ESLint 9 had no flat configuration, root `.env` values were not propagated to Turbo/Prisma commands, the health response contract was duplicated in the web app, and the API production bundle could leave workspace TypeScript packages external.

## Decision
- Load the root `.env` for local `dev`, `test`, and Prisma commands through `dotenv-cli`.
- Use one shared `HealthResponse` contract from `@javaquets/shared`.
- Treat database failure as degraded readiness (`503`) while keeping the API response inspectable by the web checkpoint page.
- Bundle internal workspace packages into the API output with tsup `noExternal`.
- Add an integration test that proves `/health` can reach PostgreSQL.
- Add an ESLint 9 flat configuration using `typescript-eslint`.
- CI explicitly generates the Prisma client and applies the schema before tests.
- Until a real `pnpm-lock.yaml` is generated and committed from a networked install, CI uses `--no-frozen-lockfile` rather than failing on a missing file. Once the lockfile is committed, CI should switch back to `--frozen-lockfile`.

## Consequences
Foundation 0 now has a coherent local boot path and a CI path that exercises the database wiring. Dependency resolution is not fully reproducible until the first successful networked `pnpm install` generates and commits `pnpm-lock.yaml`.
