import pg from 'pg';

import { SourceDTO } from '@src/dto/sourceDTO';
import { iSourceDatabase } from '@src/interfaces/iSourceDatabase';
import { SQLManager } from '@src/sqlManager';
import { dataLogger } from '@src/utils/server/logger';

export class SourceRepository implements iSourceDatabase {
  public pool: pg.Pool;
  public sqlManager: SQLManager;

  constructor(pool: pg.Pool, sqlManager: SQLManager) {
    this.pool = pool;
    this.sqlManager = sqlManager;
  }

  public getSources = async (): Promise<Array<SourceDTO>> => {
    const client = await this.pool.connect();
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

  public getSource = async (id: number): Promise<SourceDTO | null> => {
    const client = await this.pool.connect();
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
}
