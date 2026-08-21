export type AchievementDto = { slug: string; title: string; description: string; unlockedAt: string };
export type XpEventDto = { id: string; amount: number; reason: string; createdAt: string };
export type GamificationDto = {
  totalXp: number;
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  currentStreak: number;
  longestStreak: number;
  achievements: AchievementDto[];
  recentXp: XpEventDto[];
};
