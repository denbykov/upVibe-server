import pg from 'pg';

import { Config } from '@src/entities/config';
import { iPluginManager } from '@src/interfaces/iPluginManager';

class BaseController {
  public config: Config;
  public databasePool: pg.Pool;
  public pluginManager?: iPluginManager;
  constructor(
    config: Config,
    databasePool: pg.Pool,
    pluginManager?: iPluginManager
  ) {
    this.config = config;
    this.databasePool = databasePool;
    this.pluginManager = pluginManager;
  }
}

export { BaseController };
