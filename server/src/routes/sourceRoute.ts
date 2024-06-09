import express from 'express';
import pg from 'pg';

import { UserWorker } from '@src/business/userWorker';
import { SourceController } from '@src/controllers';
import { FileRepository, UserInfoAgent, UserRepository } from '@src/data';
import { Config } from '@src/entities/config';
import { userManagementMiddleware } from '@src/middlewares';
import auth0Middleware from '@src/middlewares/auth0Middleware';
import { PluginManager } from '@src/pluginManager';
import { SQLManager } from '@src/sqlManager';

import { BaseRoute } from './baseRoute';
import { DEBUG, GENERAL } from './permissions';

export class SourceRoute extends BaseRoute {
  constructor(
    app: express.Application,
    config: Config,
    dbPool: pg.Pool,
    sqlManager: SQLManager,
    pluginManager?: PluginManager
  ) {
    super(app, 'SourceRoute', config, dbPool, sqlManager, pluginManager);
  }

  configureRoutes() {
    const controller: SourceController = new SourceController(
      this.config,
      this.dbPool,
      this.sqlManager,
      this.pluginManager
    );

    const sourcesURI = `/up-vibe/v1/sources`;
    const userWorker = new UserWorker(
      new UserRepository(this.dbPool, this.sqlManager),
      new FileRepository(this.dbPool, this.sqlManager),
      new UserInfoAgent(this.config)
    );

    this.app.get(
      `${sourcesURI}`,
      auth0Middleware(this.config),
      this.config.appDebug
        ? userManagementMiddleware([GENERAL, DEBUG], userWorker, this.config)
        : userManagementMiddleware([GENERAL], userWorker, this.config),
      controller.getSources
    );

    this.app.get(
      `${sourcesURI}/:sourceId/logo`,
      auth0Middleware(this.config),
      this.config.appDebug
        ? userManagementMiddleware([GENERAL, DEBUG], userWorker, this.config)
        : userManagementMiddleware([GENERAL], userWorker, this.config),
      controller.getSourceLogo
    );

    return this.app;
  }
}
