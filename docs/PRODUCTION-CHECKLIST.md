# Production readiness checklist

- Use Node 20 and pnpm 10 with `pnpm install --frozen-lockfile`.
- Store `DATABASE_URL`, `METRICS_TOKEN`, and platform secrets in the deployment secret manager; never in images or repository files.
- Set an HTTPS `WEB_ORIGIN`, enable `TRUST_PROXY` only behind a trusted single proxy, and terminate TLS at the trusted edge.
- Provision separate least-privilege database credentials and automated backups; replace `db push` with reviewed Prisma migrations before production.
- Keep `/metrics` private or supply its bearer token through the collector.
- Route liveness and readiness probes separately; do not restart solely because readiness is degraded.
- Move rate limits and execution queues to shared infrastructure before running multiple API replicas.
- Run Java execution on dedicated workers/hosts with no access to application secrets or the primary database.
- Alert on HTTP 5xx, auth failures, rate-limit spikes, runner unavailable/timeout/output-limit events, DB readiness, and queue saturation.
- Test session revocation, key/secret rotation, database restore, worker loss, rollback, and incident log correlation before public launch.
