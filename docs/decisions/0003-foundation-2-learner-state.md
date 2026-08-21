# ADR 0003: Learner state before production authentication

## Decision

Foundation 2 introduces a narrow learner-context middleware that accepts `x-javaquets-user-id` only as a local-development identity boundary. Domain services accept an explicit `userId`; they do not depend on HTTP auth implementation details.

Enrollment, exercise progress and quest progress are persisted separately from curriculum content. Exercise completion recomputes quest completion, and quest completion recomputes course enrollment completion.

## Why

This lets learner-state rules and API contracts stabilize before selecting a production authentication provider or building the Java sandbox. Later auth can replace the middleware without rewriting domain services, and the execution engine can become the trusted caller of the exercise-completion transition.

## Constraints

The identity header must never be treated as production authentication. Direct exercise completion is a Foundation 2 development transition and must not be exposed as the authority for code correctness once the execution engine exists.
