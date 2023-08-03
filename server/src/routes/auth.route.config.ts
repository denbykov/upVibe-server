import express from 'express';
import { AuthController } from '@src/controllers';
import { BaseRoute } from './baseRoute';
import { Config } from '@src/entities/config';
import pg from 'pg';

export class AuthRoute extends BaseRoute {
  constructor(app: express.Application, config: Config, databasePool: pg.Pool) {
    super(
      app,
      'AuthRoute',
      config,
      databasePool,
      new AuthController(config, databasePool)
    );
  }
  configureRoutes() {
    this.app.post(`${this.controller.apiURIAuth}/login`, this.controller.login);
    this.app.get(
      `${this.controller.apiURIAuth}/access-token`,
      this.controller.getAccessToken
    );
    this.app.get(
      `${this.controller.apiURIAuth}/refresh-token`,
      this.controller.getRefreshToken
    );
    this.app.delete(
      `${this.controller.apiURIAuth}/access-token`,
      this.controller.deleteAccessToken
    );
    this.app.delete(
      `${this.controller.apiURIAuth}/refresh-token`,
      this.controller.deleteRefreshToken
    );
    return this.app;
  }
}
