# Foundation 8 Verification

## Verified on the delivery host

- Clean `pnpm@10.0.0 install`: passed
- Prisma client generation: passed
- `pnpm typecheck`: passed (7/7 workspaces)
- `pnpm lint`: passed (7/7 workspaces; existing F7 explicit-any warnings remain non-blocking)
- `pnpm build`: passed after F8 (API bundle and all 13 web routes)
- Database-independent HTTP security suite: passed (headers/request IDs, hostile origin, oversized payload, unauthenticated rate limiting)

## Infrastructure-dependent gate

This host has no Docker CLI or PostgreSQL server. The complete integration suite therefore cannot run here. In CI or a Docker-enabled machine:

```bash
cp .env.example .env
docker compose -f infra/docker/docker-compose.yml up -d
pnpm db:generate
pnpm db:push
pnpm db:seed
pnpm runner:build
pnpm test
```

Then verify `/health/live` returns 200, `/health/ready` returns 200 only with both DB and runner ready, and returns 503 while liveness remains 200 when either dependency is unavailable. Exercise timeout, output-flood, runner-crash, queue-full, expired-session, learner-to-admin 403, hidden-test isolation, and draft isolation scenarios must pass before F9 deployment.
