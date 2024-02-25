import express from 'express';
import pg from 'pg';

import { Config } from '@src/entities/config';
import { PluginManager } from '@src/pluginManager';

export abstract class BaseRoute {
  app: express.Application;
  name: string;
  config: Config;
  databasePool: pg.Pool;
  pluginManager?: PluginManager;

  constructor(
    app: express.Application,
    name: string,
    config: Config,
    databasePool: pg.Pool,
    pluginManager?: PluginManager
  ) {
    this.app = app;
    this.name = name;
    this.config = config;
    this.databasePool = databasePool;
    this.pluginManager = pluginManager;
    this.configureRoutes();
  }

  public getName = () => {
    return this.name;
  };

  abstract configureRoutes(): express.Application;
}
