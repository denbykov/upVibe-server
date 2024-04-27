import express from 'express';

import { UserWorker } from '@src/business/userWorker';
import { FileController } from '@src/controllers';
import { UserInfoAgent, UserRepository } from '@src/data';
import { DBPool } from '@src/dbManager';
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
    dbPool: DBPool,
    sqlManager: SQLManager,
    pluginManager?: PluginManager
  ) {
    super(app, 'FileRoute', config, dbPool, sqlManager, pluginManager);
  }
  configureRoutes() {
    const controller: FileController = new FileController(
      this.config,
      this.dbPool,
      this.sqlManager,
      this.pluginManager
    );

    const filesURI = `/up-vibe/v1/files`;
    const userWorker = new UserWorker(
      new UserRepository(this.dbPool, this.sqlManager),
      new UserInfoAgent(this.config)
    );

    this.app.post(
      `${filesURI}`,
      auth0Middleware(this.config),
      userManagementMiddleware([GENERAL], userWorker),
      controller.downloadFileBySource
    );

    this.app.get(
      `${filesURI}`,
      auth0Middleware(this.config),
      userManagementMiddleware([GENERAL], userWorker),
      controller.getFilesByUser
    );

    this.app.get(
      `${filesURI}/:fileId`,
      auth0Middleware(this.config),
      userManagementMiddleware([GENERAL], userWorker),
      controller.getTaggedFile
    );

    return this.app;
  }
}
