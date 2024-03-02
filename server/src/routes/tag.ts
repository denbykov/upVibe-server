import express from 'express';
import pg from 'pg';

import { TagController } from '@src/controllers';
import { Config } from '@src/entities/config';
import auth0Middleware from '@src/middlewares/auth0';
import { PluginManager } from '@src/pluginManager';
import { SQLManager } from '@src/sqlManager';

import { BaseRoute } from './base';

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
      this.sqlManager
    );

    const apiURIFiles = `/${this.config.apiURI}/${this.config.apiVersion}/library/files`;
    const apiURITags = `/${this.config.apiURI}/${this.config.apiVersion}/library/tags`;

    this.app.get(
      `${apiURIFiles}/:fileId/tags`,
      auth0Middleware(this.config),
      controller.getFileTags
    );

    this.app.get(
      `${apiURITags}/:tagId/picture`,
      auth0Middleware(this.config),
      controller.getFilePictureTag
    );

    this.app.get(
      `${apiURITags}/sources`,
      auth0Middleware(this.config),
      controller.getTagSources
    );

    this.app.get(
      `${apiURITags}/sources/:sourceId/picture`,
      auth0Middleware(this.config),
      controller.getTagSourcePicture
    );

    return this.app;
  }
}
