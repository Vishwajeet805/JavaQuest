# Python execution environment

JavaQuets executes Python submissions locally through its own runner worker. The Python path does not call OnlineCompiler or another third-party compiler API.

## Build the runtime image

From the repository root:

```bash
docker build -t javaquets-python-runner:local -f infra/runner/python/Dockerfile .
```

Or build both language images with `pnpm runner:build`.

The image contains CPython 3.12 and its standard library only. Additional packages are deliberately not installed during learner submissions.

## Configure the API

Set these API environment variables when Python courses are enabled:

- `RUNNER_SERVICE_URL`: private base URL of the runner worker (for example, `http://runner-worker:4100`).
- `RUNNER_SERVICE_TOKEN`: random secret of at least 32 characters; use the same value in the worker.
- `RUNNER_EXECUTION_TIMEOUT_MS`, `RUNNER_MAX_SOURCE_BYTES`, and `RUNNER_MAX_STDIN_BYTES`: existing submission limits.

The API routes by `Course.language`. Java submissions continue to use the configured Java provider; Python submissions call the authenticated worker with `language: "PYTHON"`.

## Configure the worker

Set:

- `RUNNER_SERVICE_TOKEN`: same secret as the API.
- `JAVA_RUNNER_IMAGE=javaquets-java-runner:local`.
- `PYTHON_RUNNER_IMAGE=javaquets-python-runner:local`.
- `RUNNER_PORT=4100` (optional).

The worker needs Docker CLI access to a Docker daemon containing both images. Keep this service on a private network and restrict access to the worker host/daemon. A Docker socket is effectively host-root access: do not mount it into an internet-facing application container or share it with untrusted workloads. For production, run the worker on a dedicated, disposable VM/host or a hardened isolated execution service.

## Python sandbox properties

Each submission runs in a fresh container with:

- `python3 -I -B` (isolated mode and bytecode cache disabled).
- network disabled;
- non-root UID/GID 10001;
- read-only root filesystem and read-only source workspace;
- a small writable `/tmp` tmpfs;
- 128 MiB memory and swap limit, 0.5 CPU, 32 process limit;
- a hard wall-clock timeout and bounded captured output;
- container and temporary workspace cleanup after execution.

The runner accepts a single source string as `main.py`, or a validated list of Python files (maximum 20 files / 100 KB total) that must include `main.py`. Relative `.py` paths are supported; absolute paths and traversal segments are rejected.

The current public code-submission DTO supplies one source string, which is enough for Python classes and OOP exercises. The worker protocol is ready for multiple modules; exposing multi-file editing/submission in the learner UI is a separate follow-up.

## Test manually

With the worker running and both images built, submit a Python course CODE exercise containing:

```python
class Greeter:
    def __init__(self, name):
        self.name = name

    def greet(self):
        return f"Hello, {self.name}!"

print(Greeter("JavaQuets").greet())
```

Expected stdout:

```text
Hello, JavaQuets!
```

The exercise evaluator supplies each test case's stdin and compares normalized stdout with the stored expected output. A runtime error, timeout, or output-limit violation is returned as an execution error and does not complete the exercise.
