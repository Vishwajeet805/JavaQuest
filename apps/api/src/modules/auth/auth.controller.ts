import type { Request, Response, NextFunction } from "express";
import { env } from "@javaquets/config";
import { loginSchema, signupSchema } from "@javaquets/validation";
import { getLearnerId } from "../../common/auth/learnerContext.js";
import { SESSION_COOKIE, readCookie } from "../../common/auth/session.js";
import * as service from "./auth.service.js";
function setSession(res: Response, token: string, expiresAt: Date) {
  res.cookie(SESSION_COOKIE, token, { httpOnly:true, secure:env.NODE_ENV === "production", sameSite:"lax", path:"/", expires:expiresAt });res.setHeader("Cache-Control","no-store");res.setHeader("Pragma","no-cache");
}
export async function signup(req:Request,res:Response,next:NextFunction){try{const result=await service.signup(signupSchema.parse(req.body));setSession(res,result.session.token,result.session.expiresAt);res.status(201).json({user:result.user});}catch(e){next(e)}}
export async function login(req:Request,res:Response,next:NextFunction){try{const result=await service.login(loginSchema.parse(req.body));setSession(res,result.session.token,result.session.expiresAt);res.json({user:result.user});}catch(e){next(e)}}
export async function logout(req:Request,res:Response,next:NextFunction){try{await service.logout(readCookie(req.header("cookie"),SESSION_COOKIE));res.clearCookie(SESSION_COOKIE,{path:"/"});res.status(204).send();}catch(e){next(e)}}
export async function me(req:Request,res:Response,next:NextFunction){try{res.json(await service.me(getLearnerId(req)));}catch(e){next(e)}}
