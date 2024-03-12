import express from 'express';
import pg from 'pg';

import { UserWorker } from '@src/business/userWorker';
import { FileController } from '@src/controllers';
import { UserInfoAgent } from '@src/data/userInfoAgentRepository';
import { UserRepository } from '@src/data/userRepository';
import { Config } from '@src/entities/config';
import { auth0Middleware, userManagementMiddleware } from '@src/middlewares';
import { PluginManager } from '@src/pluginManager';
import { SQLManager } from '@src/sqlManager';

import { BaseRoute } from './baseRoute';
import { GENERAL } from './permissions';

export class FileRoute extends BaseRoute {
  constructor(
    app: express.Application,
    config: Config,
    databasePool: pg.Pool,
    sqlManager: SQLManager,
    pluginManager?: PluginManager
  ) {
    super(app, 'FileRoute', config, databasePool, sqlManager, pluginManager);
  }
  configureRoutes() {
    const controller: FileController = new FileController(
      this.config,
      this.databasePool,
      this.sqlManager,
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

    this.app.get(
      `${apiURIFiles}`,
      auth0Middleware(this.config),
      userManagementMiddleware([GENERAL], userWorker),
      controller.getFilesByUser
    );

    this.app.get(
      `${apiURIFiles}/sources`,
      auth0Middleware(this.config),
      userManagementMiddleware([GENERAL], userWorker),
      controller.getSources
    );

    this.app.get(
      `${apiURIFiles}/sources/:sourceId/logo`,
      auth0Middleware(this.config),
      userManagementMiddleware([GENERAL], userWorker),
      controller.getSourceLogo
    );

    return this.app;
  }
}
