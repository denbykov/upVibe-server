import express from 'express';
import pg from 'pg';

import { UserWorker } from '@src/business/userWorker';
import { FileController } from '@src/controllers';
import { UserInfoAgent } from '@src/data/userInfoAgentRepository';
import { UserRepository } from '@src/data/userRepository';
import { Config } from '@src/entities/config';
import { iPluginManager } from '@src/interfaces/iPluginManager';
import { auth0Middleware, userManagementMiddleware } from '@src/middlewares';

import { BaseRoute } from './baseConfig';
import { GENERAL } from './perrmisions';

export class FileRoute extends BaseRoute {
  constructor(
    app: express.Application,
    config: Config,
    databasePool: pg.Pool,
    pluginManager?: iPluginManager
  ) {
    super(app, 'FileRoute', config, databasePool, pluginManager);
  }
  configureRoutes() {
    const controller: FileController = new FileController(
      this.config,
      this.databasePool,
      this.pluginManager
    );

    const apiURIFiles = `/${this.config.apiURI}/${this.config.apiVersion}/files`;
    const userWorker = new UserWorker(
      new UserRepository(this.databasePool),
      new UserInfoAgent(this.config)
    );

    this.app.post(
      `${apiURIFiles}`,
      auth0Middleware(this.config),
      userManagementMiddleware([GENERAL], userWorker),
      controller.downloadFileBySource
    );

    return this.app;
  }
}
