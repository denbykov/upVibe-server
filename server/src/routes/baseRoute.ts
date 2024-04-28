import express from 'express';
import pg from 'pg';

import { Config } from '@src/entities/config';
import { PluginManager } from '@src/pluginManager';
import { SQLManager } from '@src/sqlManager';

export abstract class BaseRoute {
  app: express.Application;
  name: string;
  config: Config;
  dbPool: pg.Pool;
  sqlManager: SQLManager;
  pluginManager?: PluginManager;

  constructor(
    app: express.Application,
    name: string,
    config: Config,
    dbPool: pg.Pool,
    sqlManager: SQLManager,
    pluginManager?: PluginManager
  ) {
    this.app = app;
    this.name = name;
    this.config = config;
    this.dbPool = dbPool;
    this.sqlManager = sqlManager;
    this.pluginManager = pluginManager;
    this.configureRoutes();
  }

  public getName = () => {
    return this.name;
  };

  abstract configureRoutes(): express.Application;
}
