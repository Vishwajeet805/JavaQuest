import { prisma } from "@javaquets/database";
import { execFile } from "node:child_process";
import { env } from "@javaquets/config";

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
let runnerCache:{ready:boolean;checkedAt:number}|undefined;
export async function checkRunner():Promise<boolean>{
  if(runnerCache&&Date.now()-runnerCache.checkedAt<10_000)return runnerCache.ready;
  let ready:boolean;
  if(env.RUNNER_SERVICE_URL){
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),3000);
    try{const response=await fetch(`${env.RUNNER_SERVICE_URL.replace(/\/$/,"")}/health/ready`,{signal:controller.signal});ready=response.ok;}catch{ready=false;}finally{clearTimeout(timer);}
  }else ready=await new Promise<boolean>(resolve=>execFile("docker",["image","inspect",env.JAVA_RUNNER_IMAGE],{timeout:3000,windowsHide:true},error=>resolve(!error)));
  runnerCache={ready,checkedAt:Date.now()};return ready;
}
