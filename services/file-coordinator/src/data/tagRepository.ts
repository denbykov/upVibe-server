import { TagDTO } from '@dtos/tagDTO';
// import { TagMappingDTO } from '@dtos/tagMappingDTO';
import { Logger } from 'log4js';
import pg from 'pg';
import { SQLManager } from 'src/core/sqlManager';
import { TagDatabase } from 'src/interfaces/tagDatabase';

class TagRepository implements TagDatabase {
  private dbPool: pg.Pool;
  private sqlManager: SQLManager;
  private logger: Logger;
  constructor(dbPool: pg.Pool, sqlManager: SQLManager, logger: Logger) {
    this.dbPool = dbPool;
    this.sqlManager = sqlManager;
    this.logger = logger;
  }

  public getTagByFileId = async (id: string): Promise<TagDTO[]> => {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('getTagByFileId');
      const queryResult = await client.query(query, [id]);
      this.logger.info(`Query: ${query}`);
      return queryResult.rows.map((row) => TagDTO.fromJSON(row));
    } catch (error) {
      this.logger.error(`Error getting tags by file id: ${error}`);
      throw new Error(`Error getting tags by file id: ${error}`);
    } finally {
      client.release();
    }
  };
}

export { TagRepository };
