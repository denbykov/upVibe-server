import { Logger } from 'log4js';
import pg from 'pg';
import { SQLManager } from '@core/sqlManager';
import { PlaylistDatabase } from '@interfaces/playlistDatabase';

class PlaylistRepository implements PlaylistDatabase {
  public dbPool: pg.Pool;
  public sqlManager: SQLManager;
  public logger: Logger;

  constructor(dbPool: pg.Pool, sqlManager: SQLManager, logger: Logger) {
    this.dbPool = dbPool;
    this.sqlManager = sqlManager;
    this.logger = logger;
  }

  public insertUserPaylistFiles = async (
    playlistId: string,
    fileId: string,
  ): Promise<void> => {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('insertUserPaylistFiles');
      this.logger.debug(query);
      await client.query(query, [playlistId, fileId]);
    } catch (err) {
      this.logger.error(err);
      throw err;
    } finally {
      client.release();
    }
  };
}

export { PlaylistRepository };
