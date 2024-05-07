import { SQLManager } from '@core/sqlManager';
import { TagMappingDTO } from '@dtos/tagMappingDTO';
import { TagMappingPriorityDTO } from '@dtos/tagMappingPriorityDTO';
import { TagMappingDatabase } from '@interfaces/tagMappingDatabase';
import { Logger } from 'log4js';
import pg from 'pg';

class TagMappingRepository implements TagMappingDatabase {
  private dbPool: pg.Pool;
  private sqlManager: SQLManager;
  private logger: Logger;
  constructor(dbPool: pg.Pool, sqlManager: SQLManager, logger: Logger) {
    this.dbPool = dbPool;
    this.sqlManager = sqlManager;
    this.logger = logger;
  }

  public getTagMappingByFileId = async (
    userId: string,
    fileId: string
  ): Promise<TagMappingDTO> => {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('getTagMapping');
      this.logger.info(`Query: ${query}`);
      const { rows } = await client.query(query, [userId, fileId]);
      return TagMappingDTO.fromJSON(rows[0]);
    } catch (error) {
      this.logger.error(`Error getting tags mapping by file id: ${fileId}`);
      throw error;
    } finally {
      client.release();
    }
  };

  public getTagsMappingPriorityByUserId = async (
    userId: string
  ): Promise<TagMappingPriorityDTO> => {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('getTagMappingPriority');
      const { rows } = await client.query(query, [userId]);
      return TagMappingPriorityDTO.fromJSON(rows);
    } catch (error) {
      this.logger.error(
        `Error getting tags mapping priority by user id: ${userId}`
      );
      throw error;
    } finally {
      client.release();
    }
  };

  public updateTagMappingById = async (
    tagMapping: TagMappingDTO
  ): Promise<void> => {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('updateTagMapping');
      const values = [
        tagMapping.title,
        tagMapping.artist,
        tagMapping.album,
        tagMapping.picture,
        tagMapping.year,
        tagMapping.trackNumber,
        tagMapping.fixed,
        tagMapping.fileId,
      ];
      await client.query(query, values);
    } catch (error) {
      this.logger.error(`Error updating tag mapping: ${error}`);
      throw error;
    } finally {
      client.release();
    }
  };
}

export { TagMappingRepository };
