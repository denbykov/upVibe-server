import express from 'express';
import pg from 'pg';

import { FileController } from '@src/controllers';
import { Config } from '@src/entities/config';
import auth0Middleware from '@src/middlewares/auth0.middleware';

// import { auth0Middleware } from '@src/middlewares';
import { BaseRoute } from './base.route.config';

export class FileRoute extends BaseRoute {
  constructor(app: express.Application, config: Config, databasePool: pg.Pool) {
    super(app, 'FileRoute', config, databasePool);
  }
  configureRoutes() {
    const controller: FileController = new FileController(
      this.config,
      this.databasePool
    );

    const apiURIFiles = `/${this.config.apiURI}/${this.config.apiVersion}/library/files`;

    this.app.post(
      `${apiURIFiles}`,
      auth0Middleware(this.config),
      controller.startFileDownloading
    );

    this.app.get(
      `${apiURIFiles}`,
      auth0Middleware(this.config),
      controller.getFiles
    );

    this.app.get(
      `${apiURIFiles}/sources`,
      auth0Middleware(this.config),
      controller.getFileSources
    );

    this.app.get(
      `${apiURIFiles}/sources/:sourceId/picture`,
      auth0Middleware(this.config),
      controller.getFileSourcePicture
    );

    return this.app;
  }
}
