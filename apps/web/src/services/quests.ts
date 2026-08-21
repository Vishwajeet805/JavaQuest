import type { QuestDetail } from "@javaquets/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function getQuest(slug: string): Promise<QuestDetail> {
  const response = await fetch(`${API_URL}/quests/${encodeURIComponent(slug)}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Quest request failed: ${response.status}`);
  return response.json() as Promise<QuestDetail>;
}
