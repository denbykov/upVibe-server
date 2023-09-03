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

    const apiURIAuth = `/${this.config.apiURI}/${this.config.apiVersion}/auth`;

    this.app.post(`${apiURIAuth}/login`, controller.login);

    this.app.get(`${apiURIAuth}/access-token`, controller.getAccessToken);

    this.app.get(`${apiURIAuth}/refresh-token`, controller.getRefreshToken);

    this.app.delete(`${apiURIAuth}/access-token`, controller.deleteAccessToken);

    this.app.delete(
      `${apiURIAuth}/refresh-token`,
      controller.deleteRefreshToken
    );

    return this.app;
  }
}
