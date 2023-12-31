import pg from 'pg';

import { Config } from '@src/entities/config';

class BaseController {
  public config: Config;
  public databasePool: pg.Pool;
  constructor(config: Config, databasePool: pg.Pool) {
    this.config = config;
    this.databasePool = databasePool;
  }
}

export { BaseController };
