# Foundation 6 Verification

Run `pnpm install`, `pnpm db:generate`, `pnpm db:push`, then the normal `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` gates.

Runtime checks:

1. Complete an exercise and verify one 25 XP event and **First Spark**.
2. Repeat or resubmit the completed exercise and verify XP does not increase.
3. Complete a quest and verify the 100 XP quest bonus.
4. Complete a course and verify the 250 XP course bonus and **Course Conqueror**.
5. Call `GET /me/gamification` while logged out and verify HTTP 401.
6. Verify level progress, current/longest streak, achievements, and recent XP on the dashboard.

Database and runner-backed checks require PostgreSQL plus the Java runner image. Registry availability is required for the first dependency installation.
