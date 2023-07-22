import dotenv from "dotenv";
import fs from "fs";

import { serverLogger } from "@src/utils/server/logger";
import { Config } from "@src/entities/config";
import { App } from "@src/app";
import { parseConfigJSON } from "@src/utils/server/parseConfigJSON";

const env = dotenv.config({ path: "config/.env" }).parsed || {};
const configJson = parseConfigJSON(
  JSON.parse(fs.readFileSync("config/config.json", "utf-8"))
);
const config = new Config(env, configJson);
const app = new App(config);

if (config.appPort == undefined || config.appHost == undefined) {
  serverLogger.error("APP_PORT and APP_HOST are not defined");
  throw new Error("APP_PORT and APP_HOST are not defined");
}

app.getApp().listen(config.appPort, config.appHost, () => {
  app.getRoutes().forEach((route) => {
    serverLogger.info(`Routes configured for ${route.getName()}`);
  });
  serverLogger.info(
    `Server is running at http://${config.appHost}:${config.appPort}`
  );
});
