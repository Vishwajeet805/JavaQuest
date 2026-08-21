# Foundation 6 — Gamification

Foundation 6 adds durable, server-authoritative motivation systems to the learner journey.

## XP economy

- Exercise completion: 25 XP
- Quest completion: 100 XP
- Course completion: 250 XP
- XP events use a unique `(user, source type, source id)` key, so retries cannot award the same milestone twice.
- Levels follow a quadratic curve: level `n` begins at `(n - 1)^2 × 100 XP`.

## Streaks and achievements

Streaks use UTC calendar days and update only when a new XP event is earned. Included achievements cover the first exercise, first quest, first course, a three-day streak, and 500 XP.

## API and UI

`GET /me/gamification` returns the learner's XP, level progress, streaks, achievements, and ten most recent XP events. The authenticated dashboard renders all of these states without exposing a client-side award endpoint.

The existing F4 session boundary and F2/F3 progress rules remain intact.
