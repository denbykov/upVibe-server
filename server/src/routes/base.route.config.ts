import express from 'express';
import pg from 'pg';

import { Config } from '@src/entities/config';

export abstract class BaseRoute {
  app: express.Application;
  name: string;
  config: Config;
  databasePool: pg.Pool;

  constructor(
    app: express.Application,
    name: string,
    config: Config,
    databasePool: pg.Pool
  ) {
    this.app = app;
    this.name = name;
    this.config = config;
    this.databasePool = databasePool;
    this.configureRoutes();
  }

  public getName = () => {
    return this.name;
  };

  abstract configureRoutes(): express.Application;
}
