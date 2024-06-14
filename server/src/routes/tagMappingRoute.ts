import express from 'express';
import pg from 'pg';

import { UserWorker } from '@src/business/userWorker';
import { TagMappingController } from '@src/controllers';
import { FileRepository, UserInfoAgent, UserRepository } from '@src/data';
import { Config } from '@src/entities/config';
import { userManagementMiddleware } from '@src/middlewares';
import auth0Middleware from '@src/middlewares/auth0Middleware';
import { PluginManager } from '@src/pluginManager';
import { SQLManager } from '@src/sqlManager';

import { BaseRoute } from './baseRoute';
import { DEBUG, GENERAL } from './permissions';

export class TagMappingRoute extends BaseRoute {
  constructor(
    app: express.Application,
    config: Config,
    dbPool: pg.Pool,
    sqlManager: SQLManager,
    pluginManager?: PluginManager
  ) {
    super(app, 'TagMappingRoute', config, dbPool, sqlManager, pluginManager);
  }

  configureRoutes() {
    const controller: TagMappingController = new TagMappingController(
      this.config,
      this.dbPool,
      this.sqlManager,
      this.pluginManager
    );

    const filesURI = `/up-vibe/v1/files`;
    const tagsURI = `/up-vibe/v1/tags`;

    const userWorker = new UserWorker(
      new UserRepository(this.dbPool, this.sqlManager),
      new FileRepository(this.dbPool, this.sqlManager),
      new UserInfoAgent(this.config)
    );

    this.app.get(
      `${tagsURI}/tag-mapping-priority`,
      auth0Middleware(this.config),
      this.config.appDebug
        ? userManagementMiddleware([GENERAL, DEBUG], userWorker, this.config)
        : userManagementMiddleware([GENERAL], userWorker, this.config),
      controller.getTagMappingPriority
    );

    this.app.put(
      `${tagsURI}/tag-mapping-priority`,
      auth0Middleware(this.config),
      this.config.appDebug
        ? userManagementMiddleware([GENERAL, DEBUG], userWorker, this.config)
        : userManagementMiddleware([GENERAL], userWorker, this.config),
      controller.updateTagMappingPriority
    );

    this.app.put(
      `${filesURI}/:fileId/tag-mapping`,
      auth0Middleware(this.config),
      this.config.appDebug
        ? userManagementMiddleware([GENERAL, DEBUG], userWorker, this.config)
        : userManagementMiddleware([GENERAL], userWorker, this.config),
      controller.updateTagMapping
    );

    return this.app;
  }
}
