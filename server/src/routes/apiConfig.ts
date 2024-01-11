import express from 'express';
import pg from 'pg';

import { APIController } from '@src/controllers';
import { Config } from '@src/entities/config';
import { auth0Middleware, userManagementMiddleware } from '@src/middlewares';

import { BaseRoute } from './baseConfig';

export class APIRoute extends BaseRoute {
  constructor(app: express.Application, config: Config, databasePool: pg.Pool) {
    super(app, 'APIRoute', config, databasePool);
  }

  configureRoutes() {
    const controller: APIController = new APIController(
      this.config,
      this.databasePool
    );
    const apiURI = `/${this.config.apiURI}/${this.config.apiVersion}`;

    this.app.get(`${apiURI}/info`, controller.getInfo);

    this.app.get(
      `${apiURI}/auth-test`,
      auth0Middleware(this.config),
      userManagementMiddleware(this.config, this.databasePool, []),
      controller.authTest
    );

    return this.app;
  }
}
