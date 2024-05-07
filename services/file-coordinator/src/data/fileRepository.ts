import { FileDTO } from '@dtos/fileDTO';
import { Logger } from 'log4js';
import pg from 'pg';
import { SQLManager } from 'src/core/sqlManager';
import { FileDatabase } from 'src/interfaces/fileDatabase';

class FileRepository implements FileDatabase {
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
      this.logger.info(`Query: ${query}`);
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
    deviceId: string,
    userFileId: string,
    isSynchronized: boolean
  ): Promise<void> => {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('updateFileSynchronization');
      this.logger.info(`Query: ${query}`);
      await client.query(query, [
        isSynchronized,
        new Date().toISOString(),
        deviceId,
        userFileId,
      ]);
    } catch (error) {
      this.logger.error(`Error updating file synchronization: ${error}`);
      throw new Error(`Error updating file synchronization: ${error}`);
    } finally {
      client.release();
    }
  };
}

export { FileRepository };
