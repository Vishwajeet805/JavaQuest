# Foundation 7 — Admin Studio & Curriculum Publishing

Foundation 7 moves curriculum maintenance from seed files into a role-protected authoring system.

## Security boundary

- Users have an explicit `USER` or `ADMIN` role.
- Every `/admin/*` endpoint requires a valid F4 session and resolves the role from PostgreSQL on each request.
- Learner course and quest services still filter to `PUBLISHED` content.
- Solutions, hidden expected outputs, and unpublished content are returned only by protected admin endpoints.

## Authoring lifecycle

Admins can create and edit courses, modules, quests, lessons, Java exercises, solutions, execution timeouts, and public/hidden test cases. Courses and quests support draft, published, and archived states. Content versions increment on edits and lifecycle transitions; publication timestamps record the current release point.

Publish validation rejects empty quests, gaps in ordering, empty courses, and CODE exercises without starter code, a reference solution, contiguous tests, and at least one public plus one hidden test. Reorder endpoints require the complete child set, preventing omissions and foreign references.

Every create, update, reorder, publish, and archive operation writes a `ContentAuditEvent` with the responsible admin.

## Preview and version direction

The Admin Studio preview renders draft quest content using a learner-like layout while visibly exposing admin-only solutions and test metadata. F7 establishes version counters and publishing semantics. Immutable content snapshots remain the intended hardening step for a later migration; existing learner progress stays attached to stable quest/exercise records in this foundation.

## Development administrator

The deterministic development seed promotes/creates `admin@javaquets.dev` with password `AdminPass123!`. This credential is for local development only and must never be used in production. Production administrators should be provisioned through a controlled operational process.
