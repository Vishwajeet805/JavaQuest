import { createApp } from "./app.js";
import { env } from "@javaquets/config";
import { logger } from "./common/logging/logger.js";
import { prisma } from "@javaquets/database";

const app = createApp();

const server=app.listen(env.API_PORT, () => {
  logger.info(`javaquets-api listening on http://localhost:${env.API_PORT}`);
});
let shuttingDown=false;async function shutdown(signal:string){if(shuttingDown)return;shuttingDown=true;logger.info({signal},"Graceful shutdown started");server.close(async()=>{await prisma.$disconnect();logger.info("Graceful shutdown complete");process.exit(0)});setTimeout(()=>{logger.error("Graceful shutdown timed out");process.exit(1)},10_000).unref()}
process.on("SIGTERM",()=>void shutdown("SIGTERM"));process.on("SIGINT",()=>void shutdown("SIGINT"));
process.on("unhandledRejection",error=>logger.error({err:error},"Unhandled rejection"));
process.on("uncaughtException",error=>{logger.fatal({err:error},"Uncaught exception");void shutdown("uncaughtException")});
