# F4 verification

```bash
pnpm install
cp .env.example .env
docker compose -f infra/docker/docker-compose.yml up -d
pnpm db:generate
pnpm db:push
pnpm db:seed
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm dev
```

Manual auth smoke test:

```bash
curl -i -c cookies.txt -H 'content-type: application/json' -d '{"email":"you@example.com","password":"strong-pass-123","displayName":"Learner"}' http://localhost:4000/auth/signup
curl -i -b cookies.txt http://localhost:4000/auth/me
curl -i -b cookies.txt -X POST http://localhost:4000/courses/java-foundations/enroll
curl -i -b cookies.txt -X POST http://localhost:4000/auth/logout
```

Expected: signup sets `javaquets_session` with `HttpOnly`; `/auth/me` and enrollment work with cookie; protected APIs return 401 after logout.
