import { DBManager } from '@src/dbManager';
import { Config } from '@src/entities/config';
import { PluginManager } from '@src/pluginManager';
import { SQLManager } from '@src/sqlManager';

class BaseController {
  public config: Config;
  public dbManager: DBManager;
  public sqlManager: SQLManager;
  public pluginManager?: PluginManager;

  constructor(
    config: Config,
    dbManager: DBManager,
    sqlManager: SQLManager,
    pluginManager?: PluginManager
  ) {
    this.config = config;
    this.dbManager = dbManager;
    this.sqlManager = sqlManager;
    this.pluginManager = pluginManager;
  }
}

export { BaseController };
