# ADR 0005 — Security and observability boundary

## Decision

JavaQuets treats every public request and every learner program as untrusted. The API applies an exact-origin CORS policy, origin verification for unsafe methods, SameSite HttpOnly sessions, secure response headers, bounded JSON parsing, global/auth/submission rate limits, generic production errors, and structured redacted logs. Request IDs flow from an accepted inbound `X-Request-Id` or are generated at the edge and returned in responses.

Sessions are stored only as SHA-256 token hashes, have absolute and idle expiry, can be revoked, and are capped per user. Production cookies use the `__Host-` prefix and require HTTPS.

Java execution remains outside the API process in disposable containers with no network, a read-only root, dropped capabilities, no-new-privileges, memory/CPU/PID limits, a bounded tmpfs, deadline enforcement, output caps, forced cleanup, and process-local concurrency/queue limits.

## Observability

`/health/live` proves the process event loop is serving. `/health/ready` verifies PostgreSQL and the configured runner image; it returns 503 without terminating the process. `/metrics` exposes request, error, auth, publishing, runner, duration, uptime, and memory metrics and requires a bearer token when configured (mandatory in production).

## Residual risks

The rate-limit store, runner queue, and metric registry are process-local. F9 must use shared infrastructure for multi-replica enforcement and collection. Docker on the API host is an MVP isolation boundary, not a hostile multi-tenant sandbox; production should move execution to dedicated workers or a stronger sandbox. Immutable curriculum snapshots and formal Prisma migrations also remain follow-up production work.
