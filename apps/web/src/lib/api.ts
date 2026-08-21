const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
export class ApiError extends Error { constructor(message: string, readonly status: number) { super(message); } }
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { ...init, credentials: "include", cache: "no-store", headers: { ...(init.body ? { "content-type": "application/json" } : {}), ...init.headers } });
  if (!response.ok) { const body = await response.json().catch(() => null) as { error?: { message?: string } } | null; throw new ApiError(body?.error?.message ?? `Request failed (${response.status})`, response.status); }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
