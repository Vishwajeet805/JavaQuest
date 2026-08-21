# Foundation 3 verification

From the repository root:

```bash
pnpm install
cp .env.example .env
docker compose -f infra/docker/docker-compose.yml up -d
pnpm runner:build
pnpm db:generate
pnpm db:push
pnpm db:seed
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm dev
```

Enroll the demo learner first:

```bash
curl -X POST -H 'x-javaquets-user-id: demo-learner' http://localhost:4000/courses/java-foundations/enroll
```

Passing submission:

```bash
curl -X POST http://localhost:4000/quests/hello-java/exercises/print-javaquets/submissions \
  -H 'content-type: application/json' \
  -H 'x-javaquets-user-id: demo-learner' \
  -d '{"sourceCode":"public class Main { public static void main(String[] args) { System.out.println(\"JavaQuets\"); } }"}'
```

Expect `201`, `status: PASSED`, `score: 100`. Then `/me/quests/hello-java/progress` should report the exercise complete.

Try incorrect output and invalid Java. They should persist `FAILED` and `ERROR` respectively, without completing progress.

Direct POST to `/quests/hello-java/exercises/print-javaquets/complete` must return `409 CODE_EVALUATION_REQUIRED`.
