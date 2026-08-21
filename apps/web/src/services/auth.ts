import type { AuthResponseDto } from "@javaquets/shared";
import { apiFetch } from "@/lib/api";
export const signup = (input: { email: string; password: string; displayName?: string }) => apiFetch<AuthResponseDto>("/auth/signup", { method: "POST", body: JSON.stringify(input) });
export const login = (input: { email: string; password: string }) => apiFetch<AuthResponseDto>("/auth/login", { method: "POST", body: JSON.stringify(input) });
export const logout = () => apiFetch<void>("/auth/logout", { method: "POST" });
export const getMe = () => apiFetch<AuthResponseDto>("/auth/me");
