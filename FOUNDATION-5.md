# Foundation 5 — Learner Workspace UI

Foundation 5 turns the existing learning, execution, progress, and session APIs into an end-to-end browser experience.

## Included

- Signup and login screens backed by the F4 HttpOnly session cookie flow
- Client session provider and protected learner route group
- Authenticated navigation and logout
- Dashboard with enrollments, completion summary, progress, empty/loading/error states
- Course catalog, enrollment action, course curriculum and per-quest progress
- Quest workspace with lesson navigation, Java editor, Run/Submit actions, evaluator output and test results
- Exercise and quest progress indicators
- Landing, loading, error, empty and not-found experiences

## Contract policy

The F4 session architecture and F1–F3 API routes remain unchanged. Browser requests use `credentials: include`; the session token remains unavailable to JavaScript. Both **Run tests** and **Submit solution** invoke the existing evaluator-backed F3 submission endpoint because F3 currently exposes one execution contract. A future preview-only run endpoint can separate non-persistent runs if needed.

See `F5-VERIFICATION.md` for verification and runtime prerequisites.
