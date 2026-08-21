import type { NextFunction, Request, Response } from "express";
const counters=new Map<string,number>();
const durations=new Map<string,{count:number;sum:number;max:number}>();
const key=(name:string,labels:Record<string,string>)=>`${name}{${Object.entries(labels).map(([k,v])=>`${k}="${v.replace(/["\\]/g,"_")}"`).join(",")}}`;
export function increment(name:string,labels:Record<string,string>={},amount=1){const k=key(name,labels);counters.set(k,(counters.get(k)??0)+amount)}
export function observe(name:string,value:number,labels:Record<string,string>={}){const k=key(name,labels);const current=durations.get(k)??{count:0,sum:0,max:0};current.count++;current.sum+=value;current.max=Math.max(current.max,value);durations.set(k,current)}
const routeLabel=(req:Request)=>req.route?.path?`${req.baseUrl}${String(req.route.path)}`:"unmatched";
export function metricsMiddleware(req:Request,res:Response,next:NextFunction){const started=process.hrtime.bigint();res.on("finish",()=>{const labels={method:req.method,route:routeLabel(req),status:String(res.statusCode)};increment("javaquets_http_requests_total",labels);observe("javaquets_http_request_duration_ms",Number(process.hrtime.bigint()-started)/1e6,{method:req.method,route:routeLabel(req)})});next()}
export function renderMetrics(){const lines=["# JavaQuets process metrics",`javaquets_process_uptime_seconds ${process.uptime()}`,`javaquets_process_resident_memory_bytes ${process.memoryUsage().rss}`];for(const[k,v]of counters)lines.push(`${k} ${v}`);for(const[k,v]of durations){lines.push(`${k.replace("{","_count{")} ${v.count}`);lines.push(`${k.replace("{","_sum{")} ${v.sum}`);lines.push(`${k.replace("{","_max{")} ${v.max}`)}return `${lines.join("\n")}\n`}
