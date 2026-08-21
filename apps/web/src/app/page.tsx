import { getHealth } from "@/services/health";

export default async function HomePage() {
  const health = await getHealth();

  const apiConnected = health !== null;
  const dbConnected = health?.database === "connected";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-bold">JavaQuets</h1>
      <p className="text-sm text-neutral-400">Foundation 0 — end-to-end wiring check</p>

      <div className="mt-6 space-y-2 rounded-lg border border-neutral-800 p-6">
        <StatusRow label="API Status" ok={apiConnected} />
        <StatusRow label="Database Status" ok={dbConnected} />
      </div>
    </main>
  );
}

function StatusRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <p>
      {label}:{" "}
      <span className={ok ? "text-green-400" : "text-red-400"}>
        {ok ? "Connected ✓" : "Not connected ✗"}
      </span>
    </p>
  );
}
