import { SQLManager } from '@core/sqlManager';
import { FileDTO } from '@dtos/fileDTO';
import { TagDTO } from '@dtos/tagDTO';
import { TagMappingDTO } from '@dtos/tagMappingDTO';
import { TagMappingPriorityDTO } from '@dtos/tagMappingPriorityDTO';
import { FileCoordinatorDatabase } from '@interfaces/fileCoordinatorDatabase';
import { Logger } from 'log4js';
import pg from 'pg';

class FileCoordinatorRepository implements FileCoordinatorDatabase {
  private dbPool: pg.Pool;
  private sqlManager: SQLManager;
  private logger: Logger;
  constructor(dbPool: pg.Pool, sqlManager: SQLManager, logger: Logger) {
    this.dbPool = dbPool;
    this.sqlManager = sqlManager;
    this.logger = logger;
  }
  public getFileById = async (id: string): Promise<FileDTO> => {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('getFileById');
      this.logger.debug(`Query: ${query}`);
      const queryResult = await client.query(query, [id]);
      return FileDTO.fromJSON(queryResult.rows[0]);
    } catch (error) {
      this.logger.error(`Error getting file by id: ${error}`);
      throw new Error(`Error getting file by id: ${error}`);
    } finally {
      client.release();
    }
  };

  public updateFileSynchronization = async (
    userFileId: string,
    isSynchronized: boolean
  ): Promise<void> => {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('updateFileSynchronization');
      this.logger.debug(`Query: ${query}`);
      await client.query(query, [
        isSynchronized,
        new Date().toISOString(),
        userFileId,
      ]);
    } catch (error) {
      this.logger.error(`Error updating file synchronization: ${error}`);
      throw new Error(`Error updating file synchronization: ${error}`);
    } finally {
      client.release();
    }
  };

  public getTagsMappingByFileId = async (
    fileId: string
  ): Promise<TagMappingDTO[]> => {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('getTagMapping');
      this.logger.debug(`Query: ${query}`);
      const { rows } = await client.query(query, [fileId]);
      return rows.map((row) => TagMappingDTO.fromJSON(row));
    } catch (error) {
      this.logger.error(`Error getting tags mapping by file id: ${fileId}`);
      throw error;
    } finally {
      client.release();
    }
  };

  public getTagMappingsPriorityByUserId = async (
    userId: string
  ): Promise<TagMappingPriorityDTO> => {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('getTagMappingsPriority');
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

  public getTagsByFileId = async (id: string): Promise<TagDTO[]> => {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('getTagByFileId');
      const queryResult = await client.query(query, [id]);
      this.logger.debug(`Query: ${query}`);
      return queryResult.rows.map((row) => TagDTO.fromJSON(row));
    } catch (error) {
      this.logger.error(`Error getting tags by file id: ${error}`);
      throw new Error(`Error getting tags by file id: ${error}`);
    } finally {
      client.release();
    }
  };

  public getUserFileIdByFileId = async (
    fileId: string,
    userId: string
  ): Promise<string> => {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('getUserFileIdByFileId');
      const { rows } = await client.query(query, [fileId, userId]);
      return rows[0].id;
    } catch (error) {
      this.logger.error(`Error getting user file id by file id: ${error}`);
      throw error;
    } finally {
      client.release();
    }
  };
}

export { FileCoordinatorRepository };
