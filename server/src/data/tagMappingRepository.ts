import pg from 'pg';

import { TagMappingDTO } from '@src/dto/tagMappingDTO';
import { TagMappingPriorityDTO } from '@src/dto/tagMappingPriorityDTO';
import { iTagMappingDatabase } from '@src/interfaces/iTagMappingDatabase';
import { SQLManager } from '@src/sqlManager';
import { dataLogger } from '@src/utils/server/logger';

export class TagMappingRepository implements iTagMappingDatabase {
  public pool: pg.Pool;
  public sqlManager: SQLManager;

  constructor(pool: pg.Pool, sqlManager: SQLManager) {
    this.pool = pool;
    this.sqlManager = sqlManager;
  }

  public getTagMappingPriority = async (
    userId: number
  ): Promise<TagMappingPriorityDTO> => {
    const client = await this.pool.connect();
    try {
      const query = this.sqlManager.getQuery('getTagMappingPriority');
      dataLogger.debug(query);
      const queryResult = await client.query(query, [userId]);
      return TagMappingPriorityDTO.fromJSON(queryResult.rows[0]);
    } catch (err) {
      dataLogger.error(err);
      throw err;
    } finally {
      client.release();
    }
  };

  public getTagMapping = async (
    fileId: number
  ): Promise<TagMappingDTO | null> => {
    const client = await this.pool.connect();
    try {
      const query = this.sqlManager.getQuery('getTagMapping');
      dataLogger.debug(query);
      const queryResult = await client.query(query, [fileId]);
      return queryResult.rows.length === 0
        ? null
        : TagMappingDTO.fromJSON(queryResult.rows[0]);
    } catch (err) {
      dataLogger.error(err);
      throw err;
    } finally {
      client.release();
    }
  };

  public insertTagMappingPriority = async (
    tagMappingPriority: TagMappingPriorityDTO
  ): Promise<TagMappingPriorityDTO> => {
    const client = await this.pool.connect();
    try {
      const query = this.sqlManager.getQuery('insertTagMappingPriority');
      dataLogger.debug(query);
      await client.query(query);
      return tagMappingPriority;
    } catch (err) {
      dataLogger.error(err);
      throw err;
    } finally {
      client.release();
    }
  };

  public insertTagMapping = async (
    tagMapping: TagMappingDTO
  ): Promise<TagMappingDTO> => {
    const client = await this.pool.connect();
    try {
      const query = this.sqlManager.getQuery('insertTagMapping');
      dataLogger.debug(query);
      await client.query(query);
      return tagMapping;
    } catch (err) {
      dataLogger.error(err);
      throw err;
    } finally {
      client.release();
    }
  };
}
