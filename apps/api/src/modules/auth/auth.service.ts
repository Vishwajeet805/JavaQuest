import { prisma } from "@javaquets/database";
import { env } from "@javaquets/config";
import type { AuthResponseDto } from "@javaquets/shared";
import { AppError } from "../../common/errors/AppError.js";
import { hashPassword, verifyPassword } from "../../common/auth/password.js";
import { hashSessionToken, newSessionToken } from "../../common/auth/session.js";
import { increment } from "../../common/observability/metrics.js";

function dto(user: {id:string;email:string;displayName:string|null;role:"USER"|"ADMIN"}): AuthResponseDto { return { user }; }
async function createSession(userId: string) {
  const token = newSessionToken();
  const expiresAt = new Date(Date.now() + env.SESSION_TTL_DAYS * 86400000);
  const now=new Date();await prisma.authSession.deleteMany({where:{userId,OR:[{expiresAt:{lte:now}},{revokedAt:{not:null}}]}});
  const active=await prisma.authSession.findMany({where:{userId},orderBy:{lastSeenAt:"desc"},select:{id:true}});
  if(active.length>=env.MAX_SESSIONS_PER_USER)await prisma.authSession.deleteMany({where:{id:{in:active.slice(env.MAX_SESSIONS_PER_USER-1).map(item=>item.id)}}});
  await prisma.authSession.create({ data: { userId, tokenHash: hashSessionToken(token), expiresAt, lastSeenAt:now } });
  return { token, expiresAt };
}
export async function signup(input: {email:string;password:string;displayName?:string}) {
  const existing = await prisma.user.findUnique({ where: { email: input.email }, select: { id: true } });
  if (existing) throw new AppError("EMAIL_IN_USE", "An account with this email already exists", 409);
  const user = await prisma.user.create({ data: { email: input.email, displayName: input.displayName, passwordHash: await hashPassword(input.password) }, select: { id:true,email:true,displayName:true,role:true } });
  return { ...dto(user), session: await createSession(user.id) };
}
export async function login(input: {email:string;password:string}) {
  const user = await prisma.user.findUnique({ where: { email: input.email }, select: { id:true,email:true,displayName:true,role:true,passwordHash:true } });
  if (!user?.passwordHash || !(await verifyPassword(input.password, user.passwordHash))) {increment("javaquets_auth_failures_total",{reason:"invalid_credentials"});throw new AppError("INVALID_CREDENTIALS", "Email or password is incorrect", 401);}
  return { ...dto(user), session: await createSession(user.id) };
}
export async function logout(token: string | undefined) { if (token) await prisma.authSession.updateMany({ where: { tokenHash: hashSessionToken(token) },data:{revokedAt:new Date()} }); }
export async function me(userId: string): Promise<AuthResponseDto> {
  const user = await prisma.user.findUnique({ where: { id:userId }, select:{id:true,email:true,displayName:true,role:true} });
  if (!user) throw new AppError("AUTH_REQUIRED", "Authentication is required", 401);
  return dto(user);
}
