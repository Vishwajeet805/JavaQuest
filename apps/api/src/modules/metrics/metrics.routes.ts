import { Router } from "express";
import { env } from "@javaquets/config";
import { renderMetrics } from "../../common/observability/metrics.js";
export const metricsRouter=Router();
metricsRouter.get("/metrics",(req,res)=>{if(env.METRICS_TOKEN&&req.header("authorization")!==`Bearer ${env.METRICS_TOKEN}`)return res.status(401).json({error:{code:"METRICS_AUTH_REQUIRED",message:"Metrics credentials are required",details:null}});res.type("text/plain; version=0.0.4").send(renderMetrics())});
