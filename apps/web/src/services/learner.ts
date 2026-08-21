import type { CourseProgressDto, EnrollmentDto, QuestProgressDto } from "@javaquets/shared";
import { apiFetch } from "@/lib/api";
export const enroll = (slug: string) => apiFetch<EnrollmentDto>(`/courses/${encodeURIComponent(slug)}/enroll`, { method: "POST" });
export const getEnrollments = async () => (await apiFetch<{ items: EnrollmentDto[] }>("/me/enrollments")).items;
export const startQuest = (slug: string) => apiFetch<QuestProgressDto>(`/quests/${encodeURIComponent(slug)}/start`, { method: "POST" });
export const completeExercise = (quest: string, exercise: string) => apiFetch<QuestProgressDto>(`/quests/${encodeURIComponent(quest)}/exercises/${encodeURIComponent(exercise)}/complete`, { method: "POST" });
export const getQuestProgress = (slug: string) => apiFetch<QuestProgressDto>(`/me/quests/${encodeURIComponent(slug)}/progress`);
export const getCourseProgress = (slug: string) => apiFetch<CourseProgressDto>(`/me/courses/${encodeURIComponent(slug)}/progress`);
