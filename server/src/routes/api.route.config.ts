import express from 'express';
import { BaseRoute } from './baseRoute';
import { APIController } from '@src/controllers';
import { auth0Middleware } from '@src/middlewares';
import { Config } from '@src/entities/config';
import pg from 'pg';

export class APIRoute extends BaseRoute {
  constructor(app: express.Application, config: Config, databasePool: pg.Pool) {
    super(
      app,
      'APIRoute',
      config,
      databasePool,
      new APIController(config, databasePool)
    );
  }
  configureRoutes() {
    this.app.get(`${this.controller.apiURI}/info`, this.controller.getInfo);
    this.app.get(
      `${this.controller.apiURI}/auth-test`,
      auth0Middleware(this.config, this.databasePool),
      this.controller.authTest
    );
    return this.app;
  }
}
