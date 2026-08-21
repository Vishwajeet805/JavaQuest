import { createApp } from "./app.js";
import { env } from "@javaquets/config";
import { logger } from "./common/logging/logger.js";

const app = createApp();

app.listen(env.API_PORT, () => {
  logger.info(`javaquets-api listening on http://localhost:${env.API_PORT}`);
});
