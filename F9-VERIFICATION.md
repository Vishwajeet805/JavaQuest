# F9 verification

## Implemented

- Production multi-stage images for web, API, runner worker, and existing Java sandbox.
- HTTPS Caddy gateway and staging Compose contract.
- Authenticated internal execution worker; production API has no Docker socket.
- SHA-tagged GHCR image publishing and protected staging deployment workflow.
- Managed PostgreSQL bootstrap/migrate strategy, smoke tests, rollback, backup, and restore scripts.
- Production environment validation requires the runner URL/token and metrics token.

## Local verification

The F8 baseline was green under pnpm 10 before F9. The F9 lockfile was updated successfully after adding the ninth workspace. This host has no Docker Engine or PostgreSQL, so images, Compose health, migrations, runner execution, backup/restore, and end-to-end browser journeys cannot run here. No deployment credentials, registry target, domain, managed database, or staging host were supplied, so no real internet deployment was attempted.

During final verification, the local package tree became unavailable after an interrupted dependency recreation on Windows; source and lockfile are unaffected. CI is the authoritative clean Linux verification gate. Run `pnpm install --frozen-lockfile`, Prisma generate, lint, typecheck, tests, build, four image builds, then the documented staging acceptance journeys before approving deployment.
