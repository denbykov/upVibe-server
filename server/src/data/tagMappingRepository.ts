import pg from 'pg';

import { TagMappingDTO } from '@src/dtos/tagMappingDTO';
import { TagMappingPriorityDTO } from '@src/dtos/tagMappingPriorityDTO';
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

  public getTagMapping = async (fileId: string): Promise<TagMappingDTO> => {
    const client = await this.pool.connect();
    try {
      const query = this.sqlManager.getQuery('getTagMapping');
      dataLogger.debug(query);
      const queryResult = await client.query(query, [fileId]);
      return TagMappingDTO.fromJSON(queryResult.rows[0]);
    } catch (err) {
      dataLogger.error(err);
      throw err;
    } finally {
      client.release();
    }
  };

  public updateTagMapping = async (
    tagMapping: TagMappingDTO,
    fileId: string
  ): Promise<TagMappingDTO> => {
    const client = await this.pool.connect();
    try {
      const query = this.sqlManager.getQuery('updateTagMapping');
      dataLogger.debug(query);
      const queryResult = await client.query(query, [
        tagMapping.title,
        tagMapping.artist,
        tagMapping.album,
        tagMapping.picture,
        tagMapping.year,
        tagMapping.trackNumber,
        fileId,
      ]);
      return TagMappingDTO.fromJSON(queryResult.rows[0]);
    } catch (err) {
      dataLogger.error(err);
      throw err;
    } finally {
      client.release();
    }
  };

  public getTagMappingPriority = async (
    userId: string
  ): Promise<TagMappingPriorityDTO | null> => {
    const client = await this.pool.connect();
    try {
      const query = this.sqlManager.getQuery('getTagMappingPriority');
      dataLogger.debug(query);
      const queryResult = await client.query(query, [userId]);
      if (queryResult.rows.length === 0) {
        return null;
      }
      return TagMappingPriorityDTO.fromJSON(queryResult.rows);
    } catch (err) {
      dataLogger.error(err);
      throw err;
    } finally {
      client.release();
    }
  };
}
