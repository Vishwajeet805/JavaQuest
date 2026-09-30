# Direct JDK execution

The API defaults to `JAVA_RUNNER_PROVIDER=direct`: source is written unchanged
into a unique temporary Main.java, compiled with javac, then executed with java.
Multiple top-level classes are supported. Existing testcase evaluation,
submission statuses and XP rules are unchanged. No Docker daemon is used by
this path. The API Docker runtime includes Temurin JDK 21. Its Dockerfile includes
java/javac version checks and a compilation/execution smoke check as the node user.
These checks execute when the image is built; that image has not been built in
this workspace because Docker is unavailable. PR/main CI builds this API image
without publishing it and checks JDK 21 under its configured non-root user.

## Configuration

| Variable                    | Default | Meaning                                                |
| --------------------------- | ------- | ------------------------------------------------------ |
| JAVA_RUNNER_PROVIDER        | direct  | direct, onlinecompiler, remote, docker                 |
| RUNNER_COMPILE_TIMEOUT_MS   | 10000   | Compilation wall-clock limit                           |
| RUNNER_EXECUTION_TIMEOUT_MS | 5000    | Maximum runtime; smaller exercise timeout wins         |
| RUNNER_MAX_SOURCE_BYTES     | 50000   | UTF-8 source bound                                     |
| RUNNER_MAX_STDIN_BYTES      | 65536   | UTF-8 stdin bound                                      |
| RUNNER_MAX_OUTPUT_BYTES     | 16384   | Combined captured stdout/stderr bound per execution    |
| RUNNER_MAX_CONCURRENCY      | 2       | Active requests per API process, including compilation |
| RUNNER_MAX_QUEUE            | 8       | Waiting requests per API process                       |

No environment variables are removed. Existing ONLINECOMPILER_API_KEY is used
only when `onlinecompiler` is explicitly selected. RUNNER_SERVICE_URL and
RUNNER_SERVICE_TOKEN are used only for `remote`; JAVA_RUNNER_IMAGE for `docker`.
Remote URL/token pairing still validates when configured. Rollback requires an
explicit provider change; learner compile/runtime errors never trigger fallback.
Readiness checks both local executables for direct, remote health for remote,
and Docker image availability for docker. OnlineCompiler readiness checks
configuration only, not upstream reachability.

## Render setup (manual, after review)

Use Docker runtime, repository root Docker context, and `apps/api/Dockerfile`.
There is no Render blueprint in this repository; live dashboard configuration
has not been inspected. Set `JAVA_RUNNER_PROVIDER=direct`. Existing API/database,
HTTPS WEB_ORIGIN, and METRICS_TOKEN settings remain required. The defaults above
are sufficient initially. An existing OnlineCompiler key can remain for rollback;
it does not select the provider. Do not mount Docker socket or enable DinD.
If currently using native Node runtime, changing only the provider is insufficient:
the Docker image containing JDK 21 must be built and deployed after approval.

## Bounds and limitations

Application controls include byte-checked source/stdin, bounded admission queue,
separate compiler/runtime deadlines, 64 MiB heap limits, runtime metaspace cap,
byte-capped output capture, process-group SIGKILL on Unix, and finally cleanup.
The child environment allowlists PATH, JAVA_HOME and LANG (plus SystemRoot on
Windows). TMPDIR/TEMP/TMP point to the execution workspace; API secrets and
JAVA_TOOL_OPTIONS are not inherited. Compiler annotation processing is disabled.
Commands use fixed executable names and argument arrays without a shell.

**This is not container-grade isolation.** Learner code runs as the API user and
can access API-readable files, the network and other same-user processes. It can
create files/threads/processes outside the intended workspace, read secrets from
accessible files or procfs, or deliberately escape a process group. Heap limits
do not cap total native memory; no CPU quota, filesystem quota, PID limit,
network isolation or syscall restrictions are enforced. Node buffers only capped
output, but learner disk writes are not bounded. Queue/concurrency limits are per
API process. Windows cannot use Unix process groups and descendant termination
is weaker; Windows has not been tested here. Killed Linux descendants may remain
as zombies until the host init process reaps them; they cannot execute code.
Cleanup is attempted on every path with bounded retries, but filesystem errors,
API crashes, or malicious same-user interference can still prevent deletion.
Cleanup failure increments `javaquets_runner_cleanup_failures_total{provider="direct"}`
without recording raw paths/errors or replacing a completed learner result.
Workspace creation/write failures still produce RUNNER_UNAVAILABLE.
For hostile public workloads, prefer the existing dedicated sandbox
worker with a Docker-capable host (`JAVA_RUNNER_PROVIDER=remote`).

The isolated Docker worker remains unchanged. Source/stderr are returned through
the existing result contract, not logged by the runner. Tests require a real JDK
and fail clearly when absent; CI installs JDK 21 rather than silently skipping.

Validation: `DATABASE_URL=<test-url> pnpm --filter @javaquets/api test` runs the
JDK regression tests alongside database integration tests. For execution-only
checks, pass `src/common/execution/directJavaRunner.test.ts` and
`src/modules/submissions/submission.runner.test.ts` to the API test command.
