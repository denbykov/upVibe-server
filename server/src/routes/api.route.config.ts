import express from 'express';
import pg from 'pg';

import { APIController } from '@src/controllers';
import { Config } from '@src/entities/config';
import { auth0Middleware } from '@src/middlewares';

import { BaseRoute } from './baseRoute';

export class APIRoute extends BaseRoute {
  constructor(app: express.Application, config: Config, databasePool: pg.Pool) {
    super(app, 'APIRoute', config, databasePool);
  }

  configureRoutes() {
    const controller: APIController = new APIController(
      this.config,
      this.databasePool
    );

    this.app.get(`${controller.apiURI}/info`, controller.getInfo);

    this.app.get(
      `${controller.apiURI}/auth-test`,
      auth0Middleware(this.config, this.databasePool),
      controller.authTest
    );

    return this.app;
  }
}
