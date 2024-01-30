import dotenv from 'dotenv';
import express, { Express } from 'express';
import fs from 'fs';
import https from 'https';
import pg from 'pg';

import { Config } from '@src/entities/config';
import { ConfigPlugin } from '@src/entities/configPlugin';
import {
  BadJsonMiddleware,
  errorAuth0Middleware,
  requestLoggerMiddleware,
  unmatchedRoutesMiddleware,
} from '@src/middlewares';
import { APIRoute, BaseRoute, FileRoute, TagRoute } from '@src/routes';
import { pluginLoader } from '@src/utils/plugins/pluginLoader';
import { dataLogger, serverLogger } from '@src/utils/server/logger';
import { parseConfigJSON } from '@src/utils/server/parseConfigJSON';

import { PluginManager } from './pluginManager';

const env = dotenv.config({ path: 'config/.env' }).parsed || {};
const configJson = parseConfigJSON(
  JSON.parse(fs.readFileSync('config/config.json', 'utf-8'))
);
const config = new Config(env, configJson);

const configPluginJson = parseConfigJSON(
  JSON.parse(fs.readFileSync('config/plugins.json', 'utf-8'))
);
const configPlugin = new ConfigPlugin(env, configPluginJson);

const pluginManager = new PluginManager(dataLogger);

const pluginManagerPromise = (async () => {
  await pluginManager.registerPlugin(
    await pluginLoader(
      config.appPluginsLocation,
      configPlugin,
      serverLogger,
      dataLogger
    )
  );
})();

export class App {
  private readonly app: Express;
  private routes: Array<BaseRoute> = [];
  protected pool: pg.Pool;
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(requestLoggerMiddleware);
    this.pool = new pg.Pool({
      user: config.dbUser,
      host: config.dbHost,
      database: config.dbName,
      port: config.dbPort,
      password: config.dbPasswrd,
      max: config.dbMax,
    });
    pluginManagerPromise.then(() => {
      this.routes.push(new APIRoute(this.app, config, this.pool));
      this.routes.push(
        new FileRoute(this.app, config, this.pool, pluginManager)
      );
      this.routes.push(new TagRoute(this.app, config, this.pool));
      this.app.use(errorAuth0Middleware);
      this.app.use(unmatchedRoutesMiddleware);
      this.app.use(BadJsonMiddleware);
    });
  }

  public getApp(): Express {
    return this.app;
  }

  public getRoutes(): Array<BaseRoute> {
    return this.routes;
  }

  public run = () => {
    if (config.appPort == undefined || config.appHost == undefined) {
      serverLogger.error('appPort and appHost are not defined');
      throw new Error('appPort and appHost are not defined');
    }
    if (config.appUseHttps) {
      const httpsOptions = {
        key: fs.readFileSync(config.appHttpsKey),
        cert: fs.readFileSync(config.appHttpsCert),
      };
      https
        .createServer(httpsOptions, this.app)
        .listen(config.appPort, config.appHost, () => {
          this.routes.forEach((route) => {
            serverLogger.info(`Routes configured for ${route.getName()}`);
          });
          serverLogger.info(
            `Server is running at https://${config.appHost}:${config.appPort}`
          );
        });
    } else {
      this.app.listen(config.appPort, config.appHost, () => {
        this.routes.forEach((route) => {
          serverLogger.info(`Routes configured for ${route.getName()}`);
        });
        serverLogger.info(
          `Server is running at http://${config.appHost}:${config.appPort}`
        );
      });
    }
  };
}
