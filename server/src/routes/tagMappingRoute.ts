import express from 'express';
import pg from 'pg';

import { TagMappingController } from '@src/controllers/tagMappingController';
import { Config } from '@src/entities/config';
import auth0Middleware from '@src/middlewares/auth0Middleware';
import { PluginManager } from '@src/pluginManager';
import { SQLManager } from '@src/sqlManager';

import { BaseRoute } from './baseRoute';

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
      this.sqlManager
    );

    const filesURI = `/up-vibe/v1/files`;

    this.app.get(
      `${filesURI}/tag-mapping-priority`,
      auth0Middleware(this.config),
      controller.getTagMappingPriority
    );

    this.app.put(
      `${filesURI}/tag-mapping-priority`,
      auth0Middleware(this.config)
    );

    this.app.get(
      `${filesURI}/:fileId/tag-mapping`,
      auth0Middleware(this.config),
      controller.getTagMapping
    );

    this.app.put(
      `${filesURI}/:fileId/tag-mapping`,
      auth0Middleware(this.config)
    );

    return this.app;
  }
}
