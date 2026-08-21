import type { HealthResponse } from "@javaquets/shared";

function getApiUrl(): string {
  const value = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

  try {
    return new URL(value).toString().replace(/\/$/, "");
  } catch {
    throw new Error("NEXT_PUBLIC_API_URL must be a valid absolute URL");
  }
}

export async function getHealth(): Promise<HealthResponse | null> {
  try {
    const res = await fetch(`${getApiUrl()}/health`, { cache: "no-store" });
    const body = (await res.json()) as HealthResponse;

    if (res.status >= 500 && body.status !== "degraded") return null;
    return body;
  } catch {
    return null;
  }
}
