import express, { Express } from 'express';
import fs from 'fs';
import https from 'https';
import { Logger } from 'log4js';
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

export class App {
  private readonly app: Express;
  private routes: Array<BaseRoute> = [];
  protected pool: pg.Pool;
  private serverLogger: Logger;
  private config: Config;
  private pluginManager: PluginManager;
  constructor(
    config: Config,
    pluginManager: PluginManager,
    serverLogger: Logger
  ) {
    this.app = express();
    this.app.use(express.json());
    this.app.use(requestLoggerMiddleware);
    this.pool = new pg.Pool({
      user: config.dbUser,
      host: config.dbHost,
      database: config.dbName,
      port: config.dbPort,
      password: config.dbPassword,
      max: config.dbMax,
    });
    this.pluginManager = pluginManager;

    this.serverLogger = serverLogger;
    this.config = config;
  }

  public getApp(): Express {
    return this.app;
  }

  public getRoutes(): Array<BaseRoute> {
    return this.routes;
  }

  public init = async () => {
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
      this.serverLogger.error('appPort and appHost are not defined');
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
            this.serverLogger.info(`Routes configured for ${route.getName()}`);
          });
          this.serverLogger.info(
            `Server is running at https://${this.config.appHost}:${this.config.appPort}`
          );
        });
    } else {
      this.app.listen(this.config.appPort, this.config.appHost, () => {
        this.routes.forEach((route) => {
          this.serverLogger.info(`Routes configured for ${route.getName()}`);
        });
        this.serverLogger.info(
          `Server is running at http://${this.config.appHost}:${this.config.appPort}`
        );
      });
    }
  };
}
