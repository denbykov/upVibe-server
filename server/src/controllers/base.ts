import pg from 'pg';

import { Config } from '@src/entities/config';
import { PluginManager } from '@src/pluginManager';

class BaseController {
  public config: Config;
  public databasePool: pg.Pool;
  public pluginManager?: PluginManager;
  constructor(
    config: Config,
    databasePool: pg.Pool,
    pluginManager?: PluginManager
  ) {
    this.config = config;
    this.databasePool = databasePool;
    this.pluginManager = pluginManager;
  }
}

export { BaseController };
