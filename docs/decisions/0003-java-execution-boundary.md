# ADR 0003 — Java execution boundary

Foundation 3 executes learner Java in a short-lived Docker container, never in the API Node.js process.

The runner disables networking, constrains memory/CPU/PIDs, uses a read-only container filesystem, mounts only a fresh temporary workspace, caps captured output, and has both guest and host execution timeouts. The API passes no learner-controlled shell command: learner input is written only to `Main.java` and stdin.

This is an MVP isolation boundary, not a multi-tenant production sandbox. A later production execution service should run outside the API host with stronger kernel/runtime isolation, queues, rate limits, observability, and disposable workers.
