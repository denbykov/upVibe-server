import express from 'express';
import pg from 'pg';

import { UserWorker } from '@src/business/userWorker';
import { FileController } from '@src/controllers';
import { UserInfoAgent } from '@src/data/userInfoAgentRepository';
import { UserRepository } from '@src/data/userRepository';
import { Config } from '@src/entities/config';
import { auth0Middleware, userManagementMiddleware } from '@src/middlewares';

import { BaseRoute } from './baseConfig';
import { GENERAL } from './perrmisions';

export class FileRoute extends BaseRoute {
  constructor(
    app: express.Application,
    config: Config,
    databasePool: pg.Pool,
    plugins?: Promise<Map<string, any>>
  ) {
    super(app, 'FileRoute', config, databasePool, plugins);
  }
  configureRoutes() {
    const controller: FileController = new FileController(
      this.config,
      this.databasePool,
      this.plugins
    );

    const apiURIFiles = `/${this.config.apiURI}/${this.config.apiVersion}/files`;
    const userWorker = new UserWorker(
      new UserRepository(this.databasePool),
      new UserInfoAgent(this.config)
    );

    this.app.post(
      `${apiURIFiles}`,
      auth0Middleware(this.config),
      userManagementMiddleware([], userWorker),
      controller.downloadFileBySource
    );

    // this.app.get(
    //   `${apiURIFiles}`,
    //   auth0Middleware(this.config),
    //   controller.getFiles
    // );

    // this.app.get(
    //   `${apiURIFiles}/sources`,
    //   auth0Middleware(this.config),
    //   controller.getFileSources
    // );

    // this.app.get(
    //   `${apiURIFiles}/sources/:sourceId/picture`,
    //   auth0Middleware(this.config),
    //   controller.getFileSourcePicture
    // );

    return this.app;
  }
}
