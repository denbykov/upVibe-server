import express from 'express';
import fs from 'fs';
import pg from 'pg';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';

import { UserWorker } from '@src/business/userWorker';
import { APIController } from '@src/controllers';
import { UserInfoAgent } from '@src/data/userInfoAgentRepository';
import { UserRepository } from '@src/data/userRepository';
import { Config } from '@src/entities/config';
import { auth0Middleware, userManagementMiddleware } from '@src/middlewares';
import { PluginManager } from '@src/pluginManager';
import { SQLManager } from '@src/sqlManager';

import { BaseRoute } from './baseRoute';
import { GENERAL } from './permissions';

export class APIRoute extends BaseRoute {
  constructor(
    app: express.Application,
    config: Config,
    databasePool: pg.Pool,
    sqlManager: SQLManager,
    pluginManager?: PluginManager
  ) {
    super(app, 'APIRoute', config, databasePool, sqlManager, pluginManager);
  }

  configureRoutes() {
    const controller: APIController = new APIController(
      this.config,
      this.databasePool,
      this.sqlManager
    );
    const apiURI = `/${this.config.apiURI}/${this.config.apiVersion}`;
    const userWorker = new UserWorker(
      new UserRepository(this.databasePool),
      new UserInfoAgent(this.config)
    );

    const swaggerTheme = new SwaggerTheme();
    const swaggerSpec = YAML.parse(fs.readFileSync('api/0.0.1.yaml', 'utf8'));

    const theme = {
      explorer: false,
      customCss: swaggerTheme.getBuffer(SwaggerThemeNameEnum.DARK_MONOKAI),
    };

    this.app.use(
      `${apiURI}/api-docs`,
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, theme)
    );

    this.app.get(`${apiURI}/health`, controller.healthCheck);
    this.app.get(`${apiURI}/info`, controller.getInfo);

    this.app.get(
      `${apiURI}/auth-test`,
      auth0Middleware(this.config),
      userManagementMiddleware([GENERAL], userWorker),
      controller.authTest
    );

    return this.app;
  }
}
