import express from 'express';
import pg from 'pg';

import { AuthController } from '@src/controllers';
import { Config } from '@src/entities/config';

import { BaseRoute } from './baseRoute';

export class AuthRoute extends BaseRoute {
  constructor(app: express.Application, config: Config, databasePool: pg.Pool) {
    super(app, 'AuthRoute', config, databasePool);
  }

  configureRoutes() {
    const controller: AuthController = new AuthController(
      this.config,
      this.databasePool
    );

    this.app.post(`${controller.apiURIAuth}/login`, controller.login);

    this.app.get(
      `${controller.apiURIAuth}/access-token`,
      controller.getAccessToken
    );

    this.app.get(
      `${controller.apiURIAuth}/refresh-token`,
      controller.getRefreshToken
    );

    this.app.delete(
      `${controller.apiURIAuth}/access-token`,
      controller.deleteAccessToken
    );

    this.app.delete(
      `${controller.apiURIAuth}/refresh-token`,
      controller.deleteRefreshToken
    );

    return this.app;
  }
}
