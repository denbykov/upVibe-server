import { Logger } from 'log4js';
import pg from 'pg';

import { Config } from '@src/entities/config';

class DBManager {
  private static instance: DBManager;
  private config!: Config;
  private serverLogger!: Logger;
  constructor(config: Config, serverLogger: Logger) {
    if (DBManager.instance) {
      return DBManager.instance;
    }
    this.config = config;
    this.serverLogger = serverLogger;
    this.serverLogger.info('DBManager instance created');
    DBManager.instance = this;
  }

  public getPGPool = () => {
    return new pg.Pool({
      user: this.config.dbUser,
      host: this.config.dbHost,
      database: this.config.dbName,
      port: this.config.dbPort,
      password: this.config.dbPassword,
      max: this.config.dbMax,
    });
  };
}

export { DBManager };
