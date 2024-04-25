import express from 'express';

import { TagController } from '@src/controllers';
import { DBManager } from '@src/dbManager';
import { Config } from '@src/entities/config';
import auth0Middleware from '@src/middlewares/auth0Middleware';
import { PluginManager } from '@src/pluginManager';
import { SQLManager } from '@src/sqlManager';

import { BaseRoute } from './baseRoute';

export class TagRoute extends BaseRoute {
  constructor(
    app: express.Application,
    config: Config,
    dbManager: DBManager,
    sqlManager: SQLManager,
    pluginManager?: PluginManager
  ) {
    super(app, 'TagRoute', config, dbManager, sqlManager, pluginManager);
  }

  configureRoutes() {
    const controller: TagController = new TagController(
      this.config,
      this.dbManager,
      this.sqlManager,
      this.pluginManager
    );

    const filesURI = `/up-vibe/v1/files`;
    const tagsURI = `/up-vibe/v1/tags`;

    this.app.get(
      `${filesURI}/:fileId/tags`,
      auth0Middleware(this.config),
      controller.getFileTags
    );

    this.app.get(
      `${tagsURI}/:tagId/picture`,
      auth0Middleware(this.config),
      controller.getPictureOfTag
    );

    this.app.post(
      `${filesURI}/:fileId/parse-tags`,
      auth0Middleware(this.config),
      controller.parseTags
    );

    return this.app;
  }
}
