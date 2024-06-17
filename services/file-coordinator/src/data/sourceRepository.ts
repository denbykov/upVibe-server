import { SourceDTO } from '@dtos/sourceDTO';
import { SourceDatabase } from '@interfaces/sourceDatabase';
import { Logger } from 'log4js';
import pg from 'pg';
import { SQLManager } from '@core/sqlManager';

export class SourceRepository implements SourceDatabase {
  public dbPool: pg.Pool;
  public sqlManager: SQLManager;
  public logger: Logger;

  constructor(dbPool: pg.Pool, sqlManager: SQLManager, logger: Logger) {
    this.dbPool = dbPool;
    this.sqlManager = sqlManager;
    this.logger = logger;
  }

  public getSources = async (): Promise<Array<SourceDTO>> => {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('getSources');
      this.logger.debug(query);
      const queryResult = await client.query(query);
      return queryResult.rows.map((row) => SourceDTO.fromJSON(row));
    } catch (err) {
      this.logger.error(err);
      throw err;
    } finally {
      client.release();
    }
  };

  public getSource = async (id: string): Promise<SourceDTO | null> => {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('getSource');
      const queryResult = await client.query(query, [id]);

      if (queryResult.rows.length === 0) {
        return null;
      }

      return SourceDTO.fromJSON(queryResult.rows[0]);
    } catch (err) {
      throw new Error(`FilesRepository.getSource: ${err}`);
    } finally {
      client.release();
    }
  };

  public getSourcesWithParsingPermission = async (): Promise<
    Array<SourceDTO>
  > => {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('getSourcesWithParsingPermission');
      const queryResult = await client.query(query);
      return queryResult.rows.map((row) => SourceDTO.fromJSON(row));
    } catch (err) {
      throw new Error(
        `FilesRepository.getSourcesWithParsingPermission: ${err}`,
      );
    } finally {
      client.release();
    }
  };
}
