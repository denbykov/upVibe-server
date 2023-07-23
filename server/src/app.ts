import { APIRoute, AuthRoute, BaseRoute } from '@src/routes';
import { requestLogger } from '@src/middlewares';
import { Config } from './entities/config';
import express, { Express } from 'express';
import pg from 'pg';

export class App {
  private readonly app: Express;
  private routes: Array<BaseRoute> = [];
  protected pool: pg.Pool;
  constructor(config: Config) {
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
}
