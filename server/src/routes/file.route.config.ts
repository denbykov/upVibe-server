import express from 'express';
import pg from 'pg';

import { FileController } from '@src/controllers';
import { Config } from '@src/entities/config';
import { auth0Middleware } from '@src/middlewares';

import { BaseRoute } from './baseRoute';

export class FileRoute extends BaseRoute {
  constructor(app: express.Application, config: Config, databasePool: pg.Pool) {
    super(app, 'FileRoute', config, databasePool);
  }
  configureRoutes() {
    const controller: FileController = new FileController(
      this.config,
      this.databasePool
    );

    this.app.post(
      `${controller.apiURIFiles}`,
      auth0Middleware(this.config, this.databasePool),
      controller.startFileDownloading
    );

    this.app.get(
      `${controller.apiURIFiles}`,
      auth0Middleware(this.config, this.databasePool),
      controller.getFiles
    );

    this.app.get(
      `${controller.apiURIFiles}/sources`,
      auth0Middleware(this.config, this.databasePool),
      controller.getFileSources
    );

    this.app.get(
      `${controller.apiURIFiles}/sources/:sourceId/picture`,
      auth0Middleware(this.config, this.databasePool),
      controller.getFileSourcePicture
    );

    return this.app;
  }
}
