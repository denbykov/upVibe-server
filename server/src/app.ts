import express, { Express } from 'express';
import dotenv from 'dotenv';
import https from 'https';
import pg from 'pg';
import fs from 'fs';

import { APIRoute, AuthRoute, BaseRoute } from '@src/routes';
import { requestLogger } from '@src/middlewares';
import { Config } from './entities/config';
import { serverLogger } from '@src/utils/server/logger';
import { parseConfigJSON } from '@src/utils/server/parseConfigJSON';

const env = dotenv.config({ path: 'config/.env' }).parsed || {};
const configJson = parseConfigJSON(
  JSON.parse(fs.readFileSync('config/config.json', 'utf-8'))
);
const config = new Config(env, configJson);

export class App {
  private readonly app: Express;
  private routes: Array<BaseRoute> = [];
  protected pool: pg.Pool;
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(requestLogger);
    this.pool = new pg.Pool({
      user: config.dbUser,
      host: config.dbHost,
      database: config.dbName,
      port: config.dbPort,
      password: config.dbPasswrd,
      max: config.dbMax,
    });
    this.routes.push(new APIRoute(this.app, config, this.pool));
    this.routes.push(new AuthRoute(this.app, config, this.pool));
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
        key: fs.readFileSync('config/ssl/privatekey.pem'),
        cert: fs.readFileSync('config/ssl/certificate.pem'),
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

    // this.app.listen(config.appPort, config.appHost, () => {
    //   this.routes.forEach((route) => {
    //     serverLogger.info(`Routes configured for ${route.getName()}`);
    //   });
    //   serverLogger.info(
    //     `Server is running at http://${config.appHost}:${config.appPort}`
    //   );
    // });
  };
}
