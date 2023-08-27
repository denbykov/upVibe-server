import pg from 'pg';

import { Config } from '@src/entities/config';
import { File } from '@src/entities/file';
import { FileSource } from '@src/entities/source';
import { iFileDatabase } from '@src/interfaces/iFileDatabase';
import { dataLogger } from '@src/utils/server/logger';
import { PublisherAMQP } from '@src/utils/server/publisherAMQP';

export class FileRepository implements iFileDatabase {
  public pool: pg.Pool;
  constructor(pool: pg.Pool) {
    this.pool = pool;
  }

  public getFiles = async (usersId: number): Promise<File[] | null> => {
    const client = await this.pool.connect();
    try {
      const result: File[] = [];

      const query =
        'SELECT file_id as id, fs.status, fs.description, fso.id as source_id, fso.description as source_description, source_url FROM user_files ' +
        'JOIN files ' +
        'ON files.id = user_files.file_id ' +
        'JOIN file_statuses as fs ' +
        'ON files.status = fs.status ' +
        'JOIN file_sources as fso ' +
        'ON files.source_id = fso.id ' +
        'WHERE user_id = $1 ' +
        'ORDER BY file_id';
      dataLogger.debug(query);
      const resultQuery = await client.query(query, [usersId]);
      for (const file of resultQuery.rows) {
        const fileData: File = File.fromJSON(file);
        result.push(fileData);
      }
      if (result.length > 0) {
        return result;
      } else {
        return null;
      }
    } catch (err) {
      dataLogger.error(`FilesRepository.getFiles: ${err}`);
      throw err;
    } finally {
      client.release();
    }
  };

  public getFileSources = async (): Promise<FileSource[] | null> => {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT * FROM file_sources ORDER BY id';
      dataLogger.debug(query);
      const queryExecution = await client.query(query);
      const result: FileSource[] = [];
      for (const source of queryExecution.rows) {
        const sourceData: FileSource = FileSource.fromJSON(source);
        result.push(sourceData);
      }
      if (result.length > 0) {
        return result;
      } else {
        return null;
      }
    } catch (err) {
      dataLogger.error(`FilesRepository.getSources: ${err}`);
      throw err;
    } finally {
      client.release();
    }
  };

  public getFileSource = async (
    sourceId: number
  ): Promise<FileSource | null> => {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT * FROM file_sources WHERE id = $1';
      dataLogger.debug(query);
      const queryExecution = await client.query(query, [sourceId]);
      const result = FileSource.fromJSON(queryExecution.rows[0]);
      if (result) {
        return result;
      } else {
        return null;
      }
    } catch (err) {
      dataLogger.error(`FilesRepository.getPicture: ${err}`);
      throw err;
    } finally {
      client.release();
    }
  };

  public getFileBySourceUrl = async (
    sourceUrl: string
  ): Promise<number | null> => {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT id FROM files WHERE source_url = $1';
      dataLogger.debug(query);
      const queryExecution = await client.query(query, [sourceUrl]);
      if (queryExecution.rows.length > 0) {
        return queryExecution.rows[0].id;
      } else {
        return null;
      }
    } catch (err) {
      dataLogger.error(`FilesRepository.getFileBySourceUrl: ${err}`);
      throw err;
    } finally {
      client.release();
    }
  };

  public startFileDownloading = async (
    config: Config,
    userId: number,
    sourceUrl: string,
    queueDownloading: string,
    queueParsing: string
  ): Promise<void> => {
    const client = await this.pool.connect();
    try {
      const findSourceIdQuery =
        'SELECT id FROM file_sources WHERE description = $1';
      dataLogger.debug(findSourceIdQuery);
      const findSourceIdQueryExecution = await client.query(findSourceIdQuery, [
        queueDownloading.split('/')[1],
      ]);
      const sourceId = findSourceIdQueryExecution.rows[0].id;
      const query =
        'INSERT INTO files (source_url, source_id, status) VALUES ($1, $2, $3) RETURNING id';
      dataLogger.debug(query);
      const queryExecution = await client.query(query, [
        sourceUrl,
        sourceId,
        'P',
      ]);
      const fileId = queryExecution.rows[0].id;
      const queryUserFiles =
        'INSERT INTO user_files (user_id, file_id) VALUES ($1, $2)';
      dataLogger.debug(queryUserFiles);
      await client.query(queryUserFiles, [userId, fileId]);
      new PublisherAMQP(config).publishDownloadingQueue(queueDownloading, {
        type: 'get_file/youtube',
        fileId: fileId,
      });
      new PublisherAMQP(config).publishDownloadingQueue(queueParsing, {
        type: 'set_tags/youtube-native',
        fileId: fileId,
      });
    } catch (err) {
      dataLogger.error(`FilesRepository.uploadFile: ${err}`);
      throw err;
    } finally {
      client.release();
    }
  };

  public mapUserFile = async (
    userId: number,
    fileId: number
  ): Promise<boolean> => {
    const client = await this.pool.connect();
    try {
      const checkQuery =
        'SELECT * FROM user_files WHERE user_id = $1 AND file_id = $2';
      dataLogger.debug(checkQuery);
      const checkQueryExecution = await client.query(checkQuery, [
        userId,
        fileId,
      ]);
      if (checkQueryExecution.rows.length > 0) {
        return false;
      }
      const query = 'INSERT INTO user_files (user_id, file_id) VALUES ($1, $2)';
      dataLogger.debug(query);
      await client.query(query, [userId, fileId]);
      return true;
    } catch (err) {
      dataLogger.error(`FilesRepository.mapUserFile: ${err}`);
      throw err;
    } finally {
      client.release();
    }
  };
}
