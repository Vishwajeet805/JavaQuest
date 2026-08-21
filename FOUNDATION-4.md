# Foundation 4 — Authentication & Sessions

Foundation 4 replaces the development `x-javaquets-user-id` identity with real accounts and opaque server-side sessions. Passwords are hashed with Node.js scrypt; raw session tokens exist only in an HttpOnly cookie and only SHA-256 token hashes are stored in PostgreSQL.

## APIs
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

All learner progress, enrollment, and submission routes now require a valid session cookie.

## Security baseline
- HttpOnly session cookie
- Secure cookie in production
- SameSite=Lax
- Exact configured CORS web origin with credentials
- Opaque random 256-bit session tokens
- Hashed tokens at rest
- 30-day configurable expiry

This is an MVP auth baseline. Production hardening should add email verification, password reset, login rate limiting, session management/revocation UI, audit events, and stronger CSRF strategy if deployment topology becomes cross-site.
