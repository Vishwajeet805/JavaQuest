import type { SubmissionResultDto } from "@javaquets/shared";
import { apiFetch } from "@/lib/api";
export const submitCode = (
  quest: string,
  exercise: string,
  sourceCode: string,
) =>
  apiFetch<SubmissionResultDto>(
    `/quests/${encodeURIComponent(quest)}/exercises/${encodeURIComponent(exercise)}/submissions`,
    { method: "POST", body: JSON.stringify({ sourceCode }) },
  );
