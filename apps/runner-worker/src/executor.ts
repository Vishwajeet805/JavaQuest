import { execFile, spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { chmod, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, posix } from "node:path";

export type Result = {
  exitCode: number | null;
  stdout: string;
  stderr: string;
  runtimeMs: number;
  timedOut: boolean;
  outputLimitExceeded: boolean;
};
export type RunnerLanguage = "JAVA" | "PYTHON";
export type SourceFile = { path: string; content: string };

const images: Record<RunnerLanguage, string> = {
  JAVA: process.env.JAVA_RUNNER_IMAGE ?? "javaquets-java-runner:local",
  PYTHON: process.env.PYTHON_RUNNER_IMAGE ?? "javaquets-python-runner:local",
};
const maxConcurrency = numberEnv("RUNNER_MAX_CONCURRENCY", 2, 1, 32);
const maxQueue = numberEnv("RUNNER_MAX_QUEUE", 8, 0, 100);
const maxOutput = numberEnv("RUNNER_MAX_OUTPUT_BYTES", 16384, 1024, 1048576);
let active = 0;
const queue: Array<() => void> = [];

function numberEnv(name: string, fallback: number, min: number, max: number) {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} is invalid`);
  return value;
}
async function acquire() {
  if (active >= maxConcurrency) {
    if (queue.length >= maxQueue) throw Object.assign(new Error("Execution queue is full"), { statusCode: 503, code: "RUNNER_BUSY" });
    await new Promise<void>((resolve) => queue.push(resolve));
  }
  active++;
  let done = false;
  return () => { if (done) return; done = true; active--; queue.shift()?.(); };
}
function cleanupContainer(name: string) {
  return new Promise<void>((resolve) => execFile("docker", ["rm", "-f", name], { timeout: 3000, windowsHide: true }, () => resolve()));
}
export function stats() { return { active, queued: queue.length, maxConcurrency, maxQueue }; }
export function checkDocker() {
  return new Promise<boolean>((resolve) => {
    execFile("docker", ["image", "inspect", images.JAVA, images.PYTHON], { timeout: 3000, windowsHide: true }, (error) => resolve(!error));
  });
}

function validatePythonFiles(files: SourceFile[]) {
  if (!files.length || files.length > 20) throw new Error("Python submission must contain between 1 and 20 files");
  let totalBytes = 0;
  const seen = new Set<string>();
  for (const file of files) {
    const normalized = posix.normalize(file.path);
    if (normalized !== file.path || normalized.startsWith("../") || normalized.startsWith("/") ||
        !/^[a-zA-Z0-9_./-]+\.py$/.test(normalized) || normalized.split("/").some((part) => !part || part === "." || part === "..") ||
        typeof file.content !== "string" || !file.content.length || seen.has(normalized)) {
      throw new Error("Invalid Python source file");
    }
    seen.add(normalized);
    totalBytes += Buffer.byteLength(file.content);
  }
  if (totalBytes > 100_000 || !seen.has("main.py")) throw new Error("Python source files exceed limits or main.py is missing");
}

export async function execute(
  sourceCode: string,
  stdin: string,
  timeoutMs: number,
  language: RunnerLanguage = "JAVA",
  submittedFiles?: SourceFile[],
): Promise<Result> {
  const release = await acquire();
  const name = `javaquets-${language.toLowerCase()}-${randomUUID()}`;
  let dir: string | undefined;
  try {
    dir = await mkdtemp(join(tmpdir(), "javaquets-worker-"));
    if (language === "PYTHON") {
      const files = submittedFiles ?? [{ path: "main.py", content: sourceCode }];
      validatePythonFiles(files);
      for (const file of files) {
        const destination = join(dir, file.path);
        await mkdir(dirname(destination), { recursive: true, mode: 0o755 });
        await writeFile(destination, file.content, { encoding: "utf8", flag: "wx", mode: 0o644 });
        await chmod(dirname(destination), 0o755);
      }
    } else {
      await writeFile(join(dir, "Main.java"), sourceCode, "utf8");
    }

    if (language === "PYTHON") await chmod(dir, 0o755);

    const started = Date.now();
    const command = language === "PYTHON"
      ? ["python3", "-I", "-B", "/workspace/main.py"]
      : ["sh", "-lc", `javac Main.java && timeout ${Math.max(1, Math.ceil(timeoutMs / 1000))}s java -Xmx64m Main`];
    return await new Promise((resolve, reject) => {
      const child = spawn("docker", [
        "run", "--name", name, "--rm", "--network", "none",
        "--memory", "128m", "--memory-swap", "128m", "--cpus", "0.5", "--pids-limit", "32",
        "--read-only", "--tmpfs", "/tmp:rw,noexec,nosuid,size=16m,uid=10001,gid=10001",
        "--security-opt", "no-new-privileges", "--cap-drop", "ALL",
        "--user", "10001:10001", "-v", `${dir}:/workspace:ro`, "-w", "/workspace",
        images[language], ...command,
      ], { stdio: ["pipe", "pipe", "pipe"], windowsHide: true });
      let stdout = "", stderr = "", timedOut = false, outputLimitExceeded = false, settled = false;
      const kill = () => { void cleanupContainer(name); child.kill("SIGKILL"); };
      const timer = setTimeout(() => { timedOut = true; kill(); }, timeoutMs + 5000);
      const append = (target: "out" | "err", chunk: Buffer) => {
        if (target === "out") stdout += chunk.toString(); else stderr += chunk.toString();
        if (Buffer.byteLength(stdout) + Buffer.byteLength(stderr) > maxOutput) { outputLimitExceeded = true; kill(); }
      };
      child.stdout.on("data", (chunk: Buffer) => append("out", chunk));
      child.stderr.on("data", (chunk: Buffer) => append("err", chunk));
      child.on("error", (error) => {
        if (!settled) { settled = true; clearTimeout(timer); reject(error); }
      });
      child.on("close", (code) => {
        if (settled) return;
        settled = true; clearTimeout(timer);
        resolve({ exitCode: code, stdout: stdout.slice(0, maxOutput), stderr: stderr.slice(0, maxOutput), runtimeMs: Date.now() - started, timedOut, outputLimitExceeded });
      });
      child.stdin.end(stdin);
    });
  } finally {
    await cleanupContainer(name);
    if (dir) await rm(dir, { recursive: true, force: true });
    release();
  }
}
