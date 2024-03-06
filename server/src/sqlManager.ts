import fs from 'fs';
import { Logger } from 'log4js';
import path from 'path';

class SQLManager {
  private static instance: SQLManager;
  private queries: Map<string, string> = new Map();
  private dataLogger!: Logger;
  private serverLogger!: Logger;
  constructor(dataLogger: Logger, serverLogger: Logger) {
    if (SQLManager.instance) {
      return SQLManager.instance;
    }
    this.dataLogger = dataLogger;
    this.serverLogger = serverLogger;
    SQLManager.instance = this;
    this.serverLogger.info('SQLManager instance created');
  }

  public loadQueries = () => {
    const sqlDirectory = path.resolve('sql');
    const sqlFiles = fs.readdirSync(sqlDirectory);
    for (const file of sqlFiles) {
      const query = fs.readFileSync(path.resolve(sqlDirectory, file), 'utf8');
      this.queries.set(file.split('.')[0], query);
      this.dataLogger.info(`Query ${file} loaded`);
    }
  };

  public getQuery = (queryName: string): string => {
    this.dataLogger.info(`SQLManager.getQuery(${queryName})`);
    return this.queries.get(queryName) || '';
  };

  public setUp = () => {
    this.loadQueries();
  };
}

export { SQLManager };
