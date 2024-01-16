import express from 'express';
import pg from 'pg';

import { UserWorker } from '@src/business/userWorker';
import { APIController } from '@src/controllers';
import { UserInfoAgent } from '@src/data/userInfoAgentRepository';
import { UserRepository } from '@src/data/userRepository';
import { Config } from '@src/entities/config';
import { auth0Middleware, userManagementMiddleware } from '@src/middlewares';

import { BaseRoute } from './baseConfig';
import { GENERAL } from './perrmisions';

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
    const userWorker = new UserWorker(
      new UserRepository(this.databasePool),
      new UserInfoAgent(this.config)
    );

    this.app.get(`${apiURI}/info`, controller.getInfo);

    this.app.get(
      `${apiURI}/auth-test`,
      auth0Middleware(this.config),
      userManagementMiddleware([GENERAL], userWorker),
      controller.authTest
    );

    return this.app;
  }
}
