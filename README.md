# JavaQuets

Foundation 0 monorepo for the JavaQuets learning platform.

## Stack

- pnpm workspaces + Turborepo
- Next.js web app
- Express API
- PostgreSQL 17
- Prisma
- Zod-based server configuration
- Pino structured logging
- Vitest + Supertest integration testing

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
pnpm dev
```

Then open:

- Web: http://localhost:3000
- API health: http://localhost:4000/health

The web checkpoint should show both API and Database as connected. A healthy API response is:

```json
{
  "status": "ok",
  "service": "javaquets-api",
  "database": "connected"
}
```

If PostgreSQL is unavailable, `/health` returns HTTP 503 with `status: "degraded"` and `database: "disconnected"`.

## Quality checks

With PostgreSQL running:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`pnpm test` loads the root `.env` and includes an integration test for `GET /health`.

## Lockfile note

This archive was hardened in an environment without registry access, so a real `pnpm-lock.yaml` could not be generated. The first networked `pnpm install` should generate it; commit that file, then change CI back from `pnpm install --no-frozen-lockfile` to `pnpm install --frozen-lockfile` for reproducible installs.
