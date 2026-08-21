# ADR 0004 — Opaque server-side sessions

## Decision
JavaQuets Foundation 4 uses email/password accounts with scrypt password hashes and opaque random session tokens. Only a SHA-256 hash of each session token is stored in PostgreSQL; the raw token is delivered as an HttpOnly cookie.

## Why
This keeps revocation and expiry server-controlled and avoids putting learner identity or authorization state inside client-readable tokens. It also replaces the development-only identity header without changing progress or submission domain services.

## Constraints
The current baseline assumes the web and API are same-site and uses SameSite=Lax. Before a cross-site production topology, revisit cookie policy and CSRF protections. Add rate limiting, verification/reset flows, and account/session management before broad public launch.
