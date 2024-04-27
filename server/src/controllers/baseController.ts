import { DBPool } from '@src/dbManager';
import { Config } from '@src/entities/config';
import { PluginManager } from '@src/pluginManager';
import { SQLManager } from '@src/sqlManager';

class BaseController {
  public config: Config;
  public dbPool: DBPool;
  public sqlManager: SQLManager;
  public pluginManager?: PluginManager;

  constructor(
    config: Config,
    dbPool: DBPool,
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
