# Foundation 8 — Security, Observability & Production Hardening

Foundation 8 hardens the F7 platform for a public staging environment.

## Delivered controls

- Clean pnpm 10 baseline, frozen lockfile support, corrected workspace TypeScript configuration, and approved native dependency builds
- Exact-origin credentialed CORS and origin-based CSRF rejection for unsafe methods
- HSTS in production, CSP, frame denial, no-sniff, referrer and permissions policies
- Configurable body limits plus generic 413 handling
- Global, authentication, and authenticated submission throttles with standard limit/reset/retry headers
- Absolute and idle session expiry, revocation, activity tracking, maximum active sessions, and production `__Host-` cookies
- Request IDs in logs, responses, and error payloads
- Structured redacted logs that suppress credentials, cookies, tokens, source, solutions, expected outputs, and environment secrets
- Process metrics for HTTP traffic/latency/errors, auth failures, admin publishing, runner usage/outcomes/duration, uptime, and memory
- Separate liveness and readiness probes with database and runner checks
- Runner concurrency/queue caps, no-new-privileges, dropped Linux capabilities, output limits, deadline enforcement, and forced container/workspace cleanup
- Graceful shutdown and observable fatal-process handling
- Database indexes for session lifecycle and submission history
- Production environment validation and a secure CI baseline

See `docs/decisions/0005-security-observability-boundary.md` for residual risks and `F8-VERIFICATION.md` for verification evidence and remaining infrastructure checks.
