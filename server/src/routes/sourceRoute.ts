import express from 'express';
import pg from 'pg';

import { SourceController } from '@src/controllers';
import { Config } from '@src/entities/config';
import auth0Middleware from '@src/middlewares/auth0Middleware';
import { PluginManager } from '@src/pluginManager';
import { SQLManager } from '@src/sqlManager';

import { BaseRoute } from './baseRoute';

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

    this.app.get(
      `${sourcesURI}`,
      auth0Middleware(this.config),
      controller.getSources
    );

    this.app.get(
      `${sourcesURI}/:sourceId/logo`,
      auth0Middleware(this.config),
      controller.getSourceLogo
    );

    return this.app;
  }
}
