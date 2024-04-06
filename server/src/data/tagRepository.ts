import pg from 'pg';

import { TagDTO } from '@src/dto/tagDTO';
import { TagMappingDTO } from '@src/dto/tagMappingDTO';
import { iTagDatabase } from '@src/interfaces/iTagDatabase';
import { SQLManager } from '@src/sqlManager';
import { dataLogger } from '@src/utils/server/logger';

export class TagRepository implements iTagDatabase {
  public pool: pg.Pool;
  public sqlManager: SQLManager;

  constructor(pool: pg.Pool, sqlManager: SQLManager) {
    this.pool = pool;
    this.sqlManager = sqlManager;
  }

  public getFileTags = async (
    fileId: number
  ): Promise<Array<TagDTO> | null> => {
    const client = await this.pool.connect();
    try {
      const query = this.sqlManager.getQuery('getFileTags');
      dataLogger.debug(query);
      const queryResult = await client.query(query, [fileId]);
      if (queryResult.rows.length === 0) {
        return null;
      }
      return queryResult.rows.map((row) => {
        return TagDTO.fromJSON(row);
      });
    } catch (err) {
      dataLogger.error(err);
      throw err;
    } finally {
      client.release();
    }
  };

  public getTag = async (tagId: number): Promise<TagDTO | null> => {
    const client = await this.pool.connect();
    try {
      const query = this.sqlManager.getQuery('getTag');
      dataLogger.debug(query);
      const queryResult = await client.query(query, [tagId]);
      if (queryResult.rows.length > 0) {
        const result = TagDTO.fromJSON(queryResult.rows[0]);
        return result;
      } else {
        return null;
      }
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
      const queryResult = await client.query(query, [
        tagMapping.user_id,
        tagMapping.file_id,
        tagMapping.title,
        tagMapping.artist,
        tagMapping.album,
        tagMapping.picture,
        tagMapping.year,
        tagMapping.track_number,
      ]);
      return TagMappingDTO.fromJSON(queryResult.rows[0]);
    } catch (err) {
      dataLogger.error(err);
      throw err;
    } finally {
      client.release();
    }
  };

  public insertTag = async (tag: TagDTO): Promise<TagDTO> => {
    const client = await this.pool.connect();
    try {
      const query = this.sqlManager.getQuery('insertTag');
      const queryResult = await client.query(query, [
        tag.fileId,
        tag.isPrimary,
        tag.source,
        tag.status,
        tag.title,
        tag.artist,
        tag.album,
        tag.year,
        tag.trackNumber,
        tag.picturePath,
      ]);
      return TagDTO.fromJSON(queryResult.rows[0]);
    } catch (err) {
      dataLogger.error(err);
      throw err;
    } finally {
      client.release();
    }
  };

  public getPrimaryTag = async (fileId: number): Promise<TagDTO | null> => {
    const client = await this.pool.connect();
    try {
      const query = this.sqlManager.getQuery('getPrimaryTag');
      dataLogger.debug(query);
      const queryResult = await client.query(query, [fileId]);
      if (queryResult.rows.length > 0) {
        return TagDTO.fromJSON(queryResult.rows[0]);
      }
      return null;
    } catch (err) {
      dataLogger.error(err);
      throw err;
    } finally {
      client.release();
    }
  };

  public doesTagExist = async (
    fileId: number,
    sourceId: number
  ): Promise<boolean> => {
    const client = await this.pool.connect();
    try {
      const query = this.sqlManager.getQuery('doesTagExist');
      dataLogger.debug(query);
      const queryResult = await client.query(query, [fileId, sourceId]);
      return queryResult.rows.length > 0;
    } catch (err) {
      dataLogger.error(err);
      throw err;
    } finally {
      client.release();
    }
  };
}
