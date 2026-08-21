# Foundation 9 — Staging Deployment & CI/CD

F9 turns JavaQuets into a deployment-ready staging system. It does not add learner features.

## Architecture

GitHub Actions builds four immutable images: web, API, runner worker, and the Java sandbox. Caddy is the only public service and provisions HTTPS. The API connects to managed PostgreSQL and to an authenticated, internal-only runner worker. Only the worker owns the Docker socket; the public API never receives it.

The worker retains F8 safeguards: no network, read-only root filesystem, dropped Linux capabilities, no-new-privileges, CPU/memory/PID caps, execution timeout, output cap, concurrency cap, bounded queue, and guaranteed container cleanup. A production execution platform should replace the Docker socket with a queue and dedicated sandbox fleet before broad public launch.

## Required GitHub configuration

Create a protected `staging` environment with approval rules. Set variable `STAGING_DOMAIN`. Set secrets `STAGING_HOST`, `STAGING_USER`, and `STAGING_SSH_KEY`. The target host keeps `/opt/javaquets/.env`, based on `infra/staging/.env.example`; do not store it in Git.

DNS must point `STAGING_DOMAIN` to the staging host and ports 80/443 must reach Caddy. Use a managed PostgreSQL instance with TLS, automated backups, point-in-time recovery, a staging-only least-privilege user, and network access restricted to the staging host.

## First deployment

Provision Docker Engine with Compose, Node 20 (for the smoke script), PostgreSQL client tools, `/opt/javaquets`, and the environment file. Log the host into GHCR. Set `BOOTSTRAP_DATABASE=true` only for the first empty staging database; this applies the current Prisma schema. Remove it immediately afterward. All subsequent schema changes must be committed Prisma migrations and are applied by `prisma migrate deploy` before rollout.

Merging a green `main` build publishes SHA-tagged and `main` images. CD uploads the deployment contract, runs migrations, starts services, and checks liveness, readiness, and metrics protection. A failed smoke check restores the previous image tag automatically.

## Operational checks

- Public: `https://<domain>/api/health/live` returns 200.
- Dependency readiness: `/api/health/ready` returns 200 only when PostgreSQL and the runner are ready.
- `/api/metrics` returns 401 without its bearer token and 200 with it.
- The runner worker has no published port and uses a separate service token.
- Secrets are injected at runtime and never baked into images or committed.

Run `STAGING_URL=https://<domain> METRICS_TOKEN=<token> node scripts/smoke-staging.mjs` after DNS or infrastructure changes.

## Backup, restore, rollback

Schedule `infra/staging/backup.sh` before migrations and daily in addition to provider backups. Encrypt dumps, upload them to separate storage, retain them per policy, and test `restore.sh` monthly against a disposable database. The restore script is intentionally explicit and destructive; review its target first.

Application rollback uses the previous SHA in `IMAGE_TAG`, then `docker compose pull && docker compose up -d`. Never roll back an incompatible database migration blindly: use a forward fix or a tested restore. Record deploy SHA, migration, backup identifier, operator, start/end time, and smoke result.

## Release gate

Before calling staging accepted, run both learner and admin browser journeys from the F9 brief, verify XP/progress, test a runner timeout, confirm draft and hidden-test isolation, simulate runner failure, verify readiness degradation, restore a backup, and execute an image rollback. These external checks require real domain, registry, host, database, and secrets.
