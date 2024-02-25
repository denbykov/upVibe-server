import dotenv from 'dotenv';
import express, { Express } from 'express';
import fs from 'fs';
import https from 'https';
import pg from 'pg';

import { Config } from '@src/entities/config';
import {
  BadJsonMiddleware,
  errorAuth0Middleware,
  requestLoggerMiddleware,
  unmatchedRoutesMiddleware,
} from '@src/middlewares';
import { PluginManager } from '@src/pluginManager';
import { APIRoute, BaseRoute, FileRoute, TagRoute } from '@src/routes';
import { dataLogger, serverLogger } from '@src/utils/server/logger';
import { parseJSONConfig } from '@src/utils/server/parseJSONConfig';

export class App {
  private readonly app: Express;
  private routes: Array<BaseRoute> = [];
  protected pool: pg.Pool;
  private config: Config;
  private pluginManager: PluginManager;
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(requestLoggerMiddleware);
    const env = dotenv.config({ path: 'config/.env' }).parsed || {};
    const configJson = parseJSONConfig(
      JSON.parse(fs.readFileSync('config/config.json', 'utf-8'))
    );
    this.config = new Config(env, configJson);
    this.pool = new pg.Pool({
      user: this.config.dbUser,
      host: this.config.dbHost,
      database: this.config.dbName,
      port: this.config.dbPort,
      password: this.config.dbPassword,
      max: this.config.dbMax,
    });
    this.pluginManager = new PluginManager(
      this.config,
      dataLogger,
      serverLogger
    );
  }

  public getApp(): Express {
    return this.app;
  }

  public getRoutes(): Array<BaseRoute> {
    return this.routes;
  }

  public init = async () => {
    await this.pluginManager.setUp();
    this.routes.push(new APIRoute(this.app, this.config, this.pool));
    this.routes.push(
      new FileRoute(this.app, this.config, this.pool, this.pluginManager)
    );
    this.routes.push(new TagRoute(this.app, this.config, this.pool));
    this.app.use(errorAuth0Middleware);
    this.app.use(unmatchedRoutesMiddleware);
    this.app.use(BadJsonMiddleware);
  };

  public run = () => {
    if (this.config.appPort == undefined || this.config.appHost == undefined) {
      serverLogger.error('appPort and appHost are not defined');
      throw new Error('appPort and appHost are not defined');
    }
    if (this.config.appUseHttps) {
      const httpsOptions = {
        key: fs.readFileSync(this.config.appHttpsKey),
        cert: fs.readFileSync(this.config.appHttpsCert),
      };
      https
        .createServer(httpsOptions, this.app)
        .listen(this.config.appPort, this.config.appHost, () => {
          this.routes.forEach((route) => {
            serverLogger.info(`Routes configured for ${route.getName()}`);
          });
          serverLogger.info(
            `Server is running at https://${this.config.appHost}:${this.config.appPort}`
          );
        });
    } else {
      this.app.listen(this.config.appPort, this.config.appHost, () => {
        this.routes.forEach((route) => {
          serverLogger.info(`Routes configured for ${route.getName()}`);
        });
        serverLogger.info(
          `Server is running at http://${this.config.appHost}:${this.config.appPort}`
        );
      });
    }
  };
}
