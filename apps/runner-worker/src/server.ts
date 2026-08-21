import { createServer } from "node:http";
import type { IncomingMessage } from "node:http";
import { randomUUID, timingSafeEqual } from "node:crypto";
import { checkDocker, execute, stats } from "./executor.js";
const port=Number(process.env.RUNNER_PORT??4100);const token=process.env.RUNNER_SERVICE_TOKEN;if(!token||token.length<32)throw new Error("RUNNER_SERVICE_TOKEN must contain at least 32 characters");
const json=(status:number,body:unknown)=>({status,body:JSON.stringify(body)});function authorized(value:string|undefined){const supplied=Buffer.from(value?.replace(/^Bearer /,"")??"");const expected=Buffer.from(token!);return supplied.length===expected.length&&timingSafeEqual(supplied,expected)}
const server=createServer(async(req,res)=>{const requestId=String(req.headers["x-request-id"]??randomId());res.setHeader("X-Request-Id",requestId);res.setHeader("X-Content-Type-Options","nosniff");let response;try{if(req.method==="GET"&&req.url==="/health/live")response=json(200,{status:"ok"});else if(req.method==="GET"&&req.url==="/health/ready")response=(await checkDocker())?json(200,{status:"ok",...stats()}):json(503,{status:"degraded",reason:"runner_image_unavailable"});else if(req.method==="POST"&&req.url==="/execute"){if(!authorized(req.headers.authorization))response=json(401,{error:{code:"RUNNER_AUTH_REQUIRED",message:"Authentication required"}});else{const raw=await readBody(req,524288);const input=JSON.parse(raw)as{sourceCode?:unknown;stdin?:unknown;timeoutMs?:unknown};if(typeof input.sourceCode!=="string"||input.sourceCode.length<1||input.sourceCode.length>100000||typeof input.stdin!=="string"||typeof input.timeoutMs!=="number"||input.timeoutMs<500||input.timeoutMs>15000)response=json(400,{error:{code:"INVALID_EXECUTION_REQUEST",message:"Execution request is invalid"}});else response=json(200,await execute(input.sourceCode,input.stdin,input.timeoutMs))}}else response=json(404,{error:{code:"NOT_FOUND",message:"Route not found"}})}catch(error){const status=typeof error==="object"&&error&&"statusCode"in error?Number(error.statusCode):500;response=json(status,{error:{code:status===503?"RUNNER_BUSY":"RUNNER_ERROR",message:status===500?"Runner failed":"Execution capacity is full",requestId}})}res.statusCode=response.status;res.setHeader("Content-Type","application/json");res.end(response.body);process.stdout.write(`${JSON.stringify({level:"info",service:"javaquets-runner-worker",requestId,method:req.method,path:req.url,status:response.status})}\n`)});server.listen(port,"0.0.0.0",()=>process.stdout.write(`${JSON.stringify({level:"info",service:"javaquets-runner-worker",message:"ready",port})}\n`));
function randomId(){return randomUUID()}
function readBody(req: IncomingMessage, limit: number) {
  return new Promise<string>((resolve, reject) => {
    let body = "",
      settled = false;

    req.on("data", (chunk) => {
      if (settled) return;

      body += chunk;

      if (Buffer.byteLength(body) > limit) {
        settled = true;
        reject(
          Object.assign(new Error("too large"), {
            statusCode: 413,
          }),
        );
      }
    });

    req.on("end", () => {
      if (!settled) resolve(body);
    });

    req.on("error", reject);
  });
}function shutdown(){server.close(()=>process.exit(0));setTimeout(()=>process.exit(1),10000).unref()}process.on("SIGTERM",shutdown);process.on("SIGINT",shutdown);
