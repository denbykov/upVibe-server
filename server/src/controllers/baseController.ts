import pg from 'pg';

import { Config } from '@src/entities/config';
import { PluginManager } from '@src/pluginManager';
import { SQLManager } from '@src/sqlManager';

class BaseController {
  public config: Config;
  public dbPool: pg.Pool;
  public sqlManager: SQLManager;
  public pluginManager?: PluginManager;

  constructor(
    config: Config,
    dbPool: pg.Pool,
    sqlManager: SQLManager,
    pluginManager?: PluginManager
  ) {
    this.config = config;
    this.dbPool = dbPool;
    this.sqlManager = sqlManager;
    this.pluginManager = pluginManager;
  }
}

export { BaseController };
