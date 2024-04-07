import express from 'express';
import pg from 'pg';

// import { UserWorker } from '@src/business/userWorker';
import { TagMappingController } from '@src/controllers';
// import { UserInfoAgent, UserRepository } from '@src/data';
import { Config } from '@src/entities/config';
// import { userManagementMiddleware } from '@src/middlewares';
import auth0Middleware from '@src/middlewares/auth0Middleware';
import { PluginManager } from '@src/pluginManager';
import { SQLManager } from '@src/sqlManager';

import { BaseRoute } from './baseRoute';

// import { GENERAL } from './permissions';

export class TagMappingRoute extends BaseRoute {
  constructor(
    app: express.Application,
    config: Config,
    databasePool: pg.Pool,
    sqlManager: SQLManager,
    pluginManager?: PluginManager
  ) {
    super(
      app,
      'TagMappingRoute',
      config,
      databasePool,
      sqlManager,
      pluginManager
    );
  }

  configureRoutes() {
    const controller: TagMappingController = new TagMappingController(
      this.config,
      this.databasePool,
      this.sqlManager,
      this.pluginManager
    );

    const filesURI = `/up-vibe/v1/files`;

    // FIXME: This is not implemented yet

    // const userWorker = new UserWorker(
    //   new UserRepository(this.databasePool, this.sqlManager),
    //   new UserInfoAgent(this.config)
    // );

    // this.app.get(
    //   `${filesURI}/tag-mapping-priority`,
    //   auth0Middleware(this.config),
    //   userManagementMiddleware([GENERAL], userWorker),
    //   controller.getTagMappingPriority
    // );

    // this.app.put(
    //   `${filesURI}/tag-mapping-priority`,
    //   auth0Middleware(this.config),
    //   userManagementMiddleware([GENERAL], userWorker),
    //   controller.updateTagMappingPriority
    // );

    this.app.put(
      `${filesURI}/:fileId/tag-mapping`,
      auth0Middleware(this.config),
      controller.updateTagMapping
    );

    return this.app;
  }
}
