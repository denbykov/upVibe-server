import pg from 'pg';

import { Config } from '@src/entities/config';
import { PluginManager } from '@src/pluginManager';
import { SQLManager } from '@src/sqlManager';

class BaseController {
  public config: Config;
  public databasePool: pg.Pool;
  public sqlManager: SQLManager;
  public pluginManager?: PluginManager;

  constructor(
    config: Config,
    databasePool: pg.Pool,
    sqlManager: SQLManager,
    pluginManager?: PluginManager
  ) {
    this.config = config;
    this.databasePool = databasePool;
    this.sqlManager = sqlManager;
    this.pluginManager = pluginManager;
  }
}

export { BaseController };
