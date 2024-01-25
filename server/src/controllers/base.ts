import pg from 'pg';

import { Config } from '@src/entities/config';

class BaseController {
  public config: Config;
  public databasePool: pg.Pool;
  public plugins?: Promise<Map<string, any>>;
  constructor(
    config: Config,
    databasePool: pg.Pool,
    plugins?: Promise<Map<string, any>>
  ) {
    this.config = config;
    this.databasePool = databasePool;
    this.plugins = plugins;
  }
}

export { BaseController };
