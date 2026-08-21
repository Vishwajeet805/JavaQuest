import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { getLearnerId } from "../auth/learnerContext.js";
type Bucket={count:number;resetAt:number};
const stores=new Map<string,Map<string,Bucket>>();
export function rateLimit(name:string,options:{windowMs:number;max:number;key?:"ip"|"user"}){
  const store=stores.get(name)??new Map<string,Bucket>();stores.set(name,store);
  return(req:Request,res:Response,next:NextFunction)=>{const now=Date.now();let key=req.ip||req.socket.remoteAddress||"unknown";if(options.key==="user"){try{key=getLearnerId(req)}catch{key=`ip:${key}`}}let bucket=store.get(key);if(!bucket||bucket.resetAt<=now){bucket={count:0,resetAt:now+options.windowMs};store.set(key,bucket)}bucket.count+=1;res.setHeader("RateLimit-Limit",String(options.max));res.setHeader("RateLimit-Remaining",String(Math.max(0,options.max-bucket.count)));res.setHeader("RateLimit-Reset",String(Math.ceil(bucket.resetAt/1000)));if(bucket.count>options.max){res.setHeader("Retry-After",String(Math.ceil((bucket.resetAt-now)/1000)));return next(new AppError("RATE_LIMITED","Too many requests",429))}if(store.size>10000)for(const[k,v]of store)if(v.resetAt<=now)store.delete(k);next()};
}
export function resetRateLimitersForTests(){stores.clear();}
