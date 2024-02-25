import express from 'express';
import pg from 'pg';

import { UserWorker } from '@src/business/userWorker';
import { FileController } from '@src/controllers';
import { UserInfoAgent } from '@src/data/userInfoAgentRepository';
import { UserRepository } from '@src/data/userRepository';
import { Config } from '@src/entities/config';
import { auth0Middleware, userManagementMiddleware } from '@src/middlewares';
import { PluginManager } from '@src/pluginManager';

import { BaseRoute } from './base';
import { GENERAL } from './permissions';

export class FileRoute extends BaseRoute {
  constructor(
    app: express.Application,
    config: Config,
    databasePool: pg.Pool,
    pluginManager?: PluginManager
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
      userManagementMiddleware([], userWorker),
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
      controller.getFileSources
    );

    this.app.get(
      `${apiURIFiles}/sources/:sourceId/picture`,
      auth0Middleware(this.config),
      userManagementMiddleware([GENERAL], userWorker),
      controller.getPictureBySourceId
    );

    return this.app;
  }
}
