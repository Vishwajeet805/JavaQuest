#!/usr/bin/env sh
set -eu

IMAGE="${PYTHON_RUNNER_IMAGE:-javaquets-python-runner:local}"
WORKSPACE="$(mktemp -d)"
trap 'rm -rf "$WORKSPACE"' EXIT

cat > "$WORKSPACE/main.py" <<'PY'
from greeter import Greeter

name = input().strip()
print(Greeter(name).greet())
PY

cat > "$WORKSPACE/greeter.py" <<'PY'
class Greeter:
    def __init__(self, name):
        self.name = name

    def greet(self):
        return f"Hello, {self.name}!"
PY

chmod 755 "$WORKSPACE"
chmod 644 "$WORKSPACE"/*.py

ACTUAL="$(printf 'JavaQuets\n' | docker run --rm --network none \
  --memory 128m --memory-swap 128m --cpus 0.5 --pids-limit 32 \
  --read-only --tmpfs /tmp:rw,noexec,nosuid,size=16m,uid=10001,gid=10001 \
  --security-opt no-new-privileges --cap-drop ALL --user 10001:10001 \
  -v "$WORKSPACE:/workspace:ro" -w /workspace "$IMAGE" \
  python3 -I -B -c 'import runpy, sys; sys.path.insert(0, "/workspace"); runpy.run_path("/workspace/main.py", run_name="__main__")')"

if [ "$ACTUAL" != "Hello, JavaQuets!" ]; then
  printf 'Python runner smoke test failed. Output: %s\n' "$ACTUAL" >&2
  exit 1
fi

printf 'Python runner smoke test passed.\n'
