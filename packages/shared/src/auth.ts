export type UserRole = "USER" | "ADMIN";
export type AuthUserDto = { id: string; email: string; displayName: string | null; role: UserRole };
export type AuthResponseDto = { user: AuthUserDto };
