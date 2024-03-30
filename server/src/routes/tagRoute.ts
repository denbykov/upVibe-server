import express from 'express';
import pg from 'pg';

import { TagController } from '@src/controllers';
import { Config } from '@src/entities/config';
import auth0Middleware from '@src/middlewares/auth0Middleware';
import { PluginManager } from '@src/pluginManager';
import { SQLManager } from '@src/sqlManager';

import { BaseRoute } from './baseRoute';

export class TagRoute extends BaseRoute {
  constructor(
    app: express.Application,
    config: Config,
    databasePool: pg.Pool,
    sqlManager: SQLManager,
    pluginManager?: PluginManager
  ) {
    super(app, 'TagRoute', config, databasePool, sqlManager, pluginManager);
  }

  configureRoutes() {
    const controller: TagController = new TagController(
      this.config,
      this.databasePool,
      this.sqlManager,
      this.pluginManager
    );

    const apiURIFiles = `/${this.config.apiURI}/v1/files`;
    const apiURITags = `/${this.config.apiURI}/v1/tags`;

    this.app.get(
      `${apiURIFiles}/:fileId/tags`,
      auth0Middleware(this.config),
      controller.getFileTags
    );

    this.app.get(
      `${apiURITags}/:tagId/picture`,
      auth0Middleware(this.config),
      controller.getPictureOfTag
    );

    this.app.get(
      `${apiURITags}/sources`,
      auth0Middleware(this.config),
      controller.getSources
    );

    this.app.get(
      `${apiURITags}/sources/:sourceId/logo`,
      auth0Middleware(this.config),
      controller.getSourceLogo
    );

    this.app.post(
      `${apiURIFiles}/:fileId/parse-tags`,
      auth0Middleware(this.config),
      controller.parseTags
    );

    return this.app;
  }
}
