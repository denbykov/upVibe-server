import pg from 'pg';

import { SourceDTO } from '@src/dtos/sourceDTO';
import { iSourceDatabase } from '@src/interfaces/iSourceDatabase';
import { SQLManager } from '@src/sqlManager';
import { dataLogger } from '@src/utils/server/logger';

export class SourceRepository implements iSourceDatabase {
  public dbPool: pg.Pool;
  public sqlManager: SQLManager;

  constructor(dbPool: pg.Pool, sqlManager: SQLManager) {
    this.dbPool = dbPool;
    this.sqlManager = sqlManager;
  }

  public getSources = async (): Promise<Array<SourceDTO>> => {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('getSources');
      dataLogger.debug(query);
      const queryResult = await client.query(query);
      return queryResult.rows.map((row) => SourceDTO.fromJSON(row));
    } catch (err) {
      dataLogger.error(err);
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
        `FilesRepository.getSourcesWithParsingPermission: ${err}`
      );
    } finally {
      client.release();
    }
  };
}
