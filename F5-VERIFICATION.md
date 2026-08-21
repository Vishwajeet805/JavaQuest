# Foundation 5 Verification

## Automated checks

From the repository root:

```bash
pnpm install
pnpm db:generate
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Runtime verification

1. Copy `.env.example` to `.env`.
2. Start PostgreSQL and apply/seed the schema.
3. Build the Java runner image with `pnpm runner:build`.
4. Start API and web with `pnpm dev`.
5. Open `http://localhost:3000`.
6. Verify signup redirects to the dashboard and refresh preserves the session.
7. Enroll in **Java Foundations**, open **Hello, Java**, read both lessons, and open **Print JavaQuets**.
8. Submit a failing program and verify the failed output panel.
9. Submit a program that prints `JavaQuets` and verify PASSED, exercise completion, quest progress, and course progress.
10. Log out and verify protected routes redirect to `/login`.

## Environment-dependent checks

Java execution requires Docker and the local `javaquets-java-runner:local` image. Integration tests require a reachable PostgreSQL database. If dependency installation or either service is unavailable, record the failing command and rerun the sequence in a Node 20+, pnpm 10, Docker-enabled environment.
