import fs from 'fs';
import path from 'path';
import { Logger } from 'log4js';

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
    this.dataLogger.trace(`SQLManager.getQuery(${queryName})`);
    const query = this.queries.get(queryName)!;
    if (query.length == 0) {
      throw new Error(`Query ${queryName} is empty`);
    }
    return query;
  };

  public setUp = () => {
    this.loadQueries();
  };
}

export { SQLManager };
