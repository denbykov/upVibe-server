import express from 'express';
import fs from 'fs';
import redoc from 'redoc-express';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';

import { UserWorker } from '@src/business/userWorker';
import { APIController } from '@src/controllers';
import { UserInfoAgent, UserRepository } from '@src/data';
import { DBPool } from '@src/dbManager';
import { Config } from '@src/entities/config';
import { auth0Middleware, userManagementMiddleware } from '@src/middlewares';
import { PluginManager } from '@src/pluginManager';
import { SQLManager } from '@src/sqlManager';

import { BaseRoute } from './baseRoute';
import { DEBUG, GENERAL } from './permissions';

export class APIRoute extends BaseRoute {
  constructor(
    app: express.Application,
    config: Config,
    dbPool: DBPool,
    sqlManager: SQLManager,
    pluginManager?: PluginManager
  ) {
    super(app, 'APIRoute', config, dbPool, sqlManager, pluginManager);
  }

  configureRoutes() {
    const controller: APIController = new APIController(
      this.config,
      this.dbPool,
      this.sqlManager
    );
    const apiURI = `/up-vibe/v1`;
    const userWorker = new UserWorker(
      new UserRepository(this.dbPool, this.sqlManager),
      new UserInfoAgent(this.config)
    );

    const swaggerTheme = new SwaggerTheme();
    const swaggerSpec = YAML.parse(fs.readFileSync('api/0.0.1.yaml', 'utf8'));

    const theme = {
      explorer: false,
      customCss: swaggerTheme.getBuffer(SwaggerThemeNameEnum.DARK_MONOKAI),
    };

    this.app.use(
      `${apiURI}/api`,
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, theme)
    );

    this.app.get(`${apiURI}/docs/swagger.json`, controller.getSwaggerSpec);

    this.app.get(
      `${apiURI}/docs`,
      redoc({
        title: 'API Docs',
        specUrl: `${apiURI}/docs/swagger.json`,
        nonce: '',
        redocOptions: {
          theme: {
            colors: {
              primary: {
                main: '#6EC5AB',
              },
            },
            typography: {
              fontFamily: `"museo-sans", 'Helvetica Neue', Helvetica, Arial, sans-serif`,
              fontSize: '15px',
              lineHeight: '1.5',
              code: {
                code: '#87E8C7',
                backgroundColor: '#4D4D4E',
              },
            },
            menu: {
              backgroundColor: '#ffffff',
            },
          },
        },
      })
    );

    this.app.get(`${apiURI}/health`, controller.healthCheck);

    this.app.get(`${apiURI}/info`, controller.getInfo);

    this.app.get(
      `${apiURI}/auth-test`,
      auth0Middleware(this.config),
      this.config.appDebug
        ? userManagementMiddleware([GENERAL, DEBUG], userWorker, this.config)
        : userManagementMiddleware([GENERAL], userWorker, this.config),
      controller.authTest
    );

    this.app.post(
      `${apiURI}/register`,
      auth0Middleware(this.config),
      controller.register
    );

    return this.app;
  }
}
