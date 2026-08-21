import { prisma } from "@javaquets/database";
import type { GamificationDto } from "@javaquets/shared";

const DAY_MS = 86_400_000;
const atUtcDay = (date: Date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
export const levelForXp = (xp: number) => Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1;
export const xpForLevel = (level: number) => Math.pow(Math.max(0, level - 1), 2) * 100;

export async function awardXp(userId: string, input: { amount: number; reason: string; sourceType: string; sourceId: string }) {
  const key = { userId_sourceType_sourceId: { userId, sourceType: input.sourceType, sourceId: input.sourceId } };
  const existing = await prisma.xpEvent.findUnique({ where: key });
  if (existing) return false;
  const now = new Date();
  const today = atUtcDay(now);
  const profile = await prisma.gamificationProfile.findUnique({ where: { userId } });
  let streak = profile?.currentStreak ?? 0;
  if (!profile?.lastActiveOn) streak = 1;
  else {
    const days = Math.round((today.getTime() - atUtcDay(profile.lastActiveOn).getTime()) / DAY_MS);
    if (days === 1) streak += 1;
    else if (days > 1) streak = 1;
  }
  await prisma.$transaction([
    prisma.xpEvent.create({ data: { userId, ...input } }),
    prisma.gamificationProfile.upsert({
      where: { userId },
      create: { userId, totalXp: input.amount, currentStreak: streak, longestStreak: streak, lastActiveOn: today },
      update: { totalXp: { increment: input.amount }, currentStreak: streak, longestStreak: Math.max(streak, profile?.longestStreak ?? 0), lastActiveOn: today },
    }),
  ]);
  await unlockAchievements(userId);
  return true;
}

async function unlockAchievements(userId: string) {
  const [profile, exercises, quests, courses] = await Promise.all([
    prisma.gamificationProfile.findUnique({ where: { userId } }),
    prisma.exerciseProgress.count({ where: { userId, status: "COMPLETED" } }),
    prisma.questProgress.count({ where: { userId, status: "COMPLETED" } }),
    prisma.enrollment.count({ where: { userId, status: "COMPLETED" } }),
  ]);
  const candidates = [
    exercises >= 1 && { slug: "first-spark", title: "First Spark", description: "Complete your first exercise." },
    quests >= 1 && { slug: "quest-complete", title: "Quest Complete", description: "Complete your first quest." },
    courses >= 1 && { slug: "course-conqueror", title: "Course Conqueror", description: "Complete your first course." },
    (profile?.currentStreak ?? 0) >= 3 && { slug: "three-day-flame", title: "Three-Day Flame", description: "Learn on three consecutive days." },
    (profile?.totalXp ?? 0) >= 500 && { slug: "xp-500", title: "Momentum", description: "Earn 500 XP." },
  ].filter((item): item is { slug: string; title: string; description: string } => Boolean(item));
  await Promise.all(candidates.map((achievement) => prisma.userAchievement.upsert({ where: { userId_slug: { userId, slug: achievement.slug } }, update: {}, create: { userId, ...achievement } })));
}

export async function getGamification(userId: string): Promise<GamificationDto> {
  const [profile, achievements, recentXp] = await Promise.all([
    prisma.gamificationProfile.findUnique({ where: { userId } }),
    prisma.userAchievement.findMany({ where: { userId }, orderBy: { unlockedAt: "desc" } }),
    prisma.xpEvent.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10 }),
  ]);
  const totalXp = profile?.totalXp ?? 0;
  const level = levelForXp(totalXp);
  const levelStart = xpForLevel(level);
  const levelEnd = xpForLevel(level + 1);
  return {
    totalXp, level, currentLevelXp: totalXp - levelStart, nextLevelXp: levelEnd - levelStart,
    currentStreak: profile?.currentStreak ?? 0, longestStreak: profile?.longestStreak ?? 0,
    achievements: achievements.map((a) => ({ slug: a.slug, title: a.title, description: a.description, unlockedAt: a.unlockedAt.toISOString() })),
    recentXp: recentXp.map((e) => ({ id: e.id, amount: e.amount, reason: e.reason, createdAt: e.createdAt.toISOString() })),
  };
}
