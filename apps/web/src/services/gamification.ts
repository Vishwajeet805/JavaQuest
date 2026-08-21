import type { GamificationDto } from "@javaquets/shared";
import { apiFetch } from "@/lib/api";
export const getGamification = () => apiFetch<GamificationDto>("/me/gamification");
