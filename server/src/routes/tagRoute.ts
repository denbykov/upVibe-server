import express from 'express';
import pg from 'pg';

import { UserWorker } from '@src/business/userWorker';
import { TagController } from '@src/controllers';
import { FileRepository, UserInfoAgent, UserRepository } from '@src/data';
import { Config } from '@src/entities/config';
import { userManagementMiddleware } from '@src/middlewares';
import auth0Middleware from '@src/middlewares/auth0Middleware';
import { PluginManager } from '@src/pluginManager';
import { SQLManager } from '@src/sqlManager';

import { BaseRoute } from './baseRoute';
import { DEBUG, GENERAL } from './permissions';

export class TagRoute extends BaseRoute {
  constructor(
    app: express.Application,
    config: Config,
    dbPool: pg.Pool,
    sqlManager: SQLManager,
    pluginManager?: PluginManager
  ) {
    super(app, 'TagRoute', config, dbPool, sqlManager, pluginManager);
  }

  configureRoutes() {
    const controller: TagController = new TagController(
      this.config,
      this.dbPool,
      this.sqlManager,
      this.pluginManager
    );
    const userWorker = new UserWorker(
      new UserRepository(this.dbPool, this.sqlManager),
      new FileRepository(this.dbPool, this.sqlManager),
      new UserInfoAgent(this.config)
    );

    const filesURI = `/up-vibe/v1/files`;
    const tagsURI = `/up-vibe/v1/tags`;

    this.app.get(
      `${filesURI}/:fileId/tags`,
      auth0Middleware(this.config),
      this.config.appDebug
        ? userManagementMiddleware([GENERAL, DEBUG], userWorker, this.config)
        : userManagementMiddleware([GENERAL], userWorker, this.config),
      controller.getFileTags
    );

    this.app.get(
      `${tagsURI}/:tagId/picture`,
      auth0Middleware(this.config),
      this.config.appDebug
        ? userManagementMiddleware([GENERAL, DEBUG], userWorker, this.config)
        : userManagementMiddleware([GENERAL], userWorker, this.config),
      controller.getPictureOfTag
    );

    this.app.post(`${filesURI}/:fileId/parse-tags`, controller.parseTags);

    return this.app;
  }
}
