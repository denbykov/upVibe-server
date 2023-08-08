import pg from 'pg';

import { File } from '@src/entities/file';
import { iFileDatabase } from '@src/interfaces/iFileDatabase';
import { dataLogger } from '@src/utils/server/logger';

import { FileSource } from './../entities/source';

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
}
