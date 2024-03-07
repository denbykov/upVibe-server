import pg from 'pg';

import { FileSourcesDTO } from '@src/dto/file';
import { FileDTO } from '@src/dto/file';
import { FileSourceDTO, TagSourceDTO } from '@src/dto/source';
import { TaggedFileDTO } from '@src/dto/taggedFile';
import { UserDTO } from '@src/dto/user';
import { File } from '@src/entities/file';
import { FileSource } from '@src/entities/source';
import { TaggedFile, TaggedFiles } from '@src/entities/taggedFile';
import { iFileDatabase } from '@src/interfaces/iFileDatabase';
import { SQLManager } from '@src/sqlManager';
import { dataLogger } from '@src/utils/server/logger';

export class FileRepository implements iFileDatabase {
  public pool: pg.Pool;
  public sqlManager: SQLManager;
  constructor(pool: pg.Pool, sqlManager: SQLManager) {
    this.pool = pool;
    this.sqlManager = sqlManager;
  }

  public getFileByUrl = async (url: string): Promise<TaggedFile | null> => {
    const client = await this.pool.connect();
    try {
      const query = this.sqlManager.getQuery('getFileByUrl');
      dataLogger.debug(query);
      const queryExecution = await client.query(query, [url]);
      if (queryExecution.rows.length > 0) {
        const taggedFile = TaggedFileDTO.fromJSON(queryExecution.rows[0]);
        if (taggedFile.tags?.title) {
          return taggedFile;
        }
        taggedFile.tags = null;
        return taggedFile;
      } else {
        return null;
      }
    } catch (err) {
      dataLogger.error(`FilesRepository.getFileByUrl: ${err}`);
      return null;
    } finally {
      dataLogger.debug('FilesRepository.getFileByUrl: client.release()');
      client.release();
    }
  };

  public getFilesByUser = async (
    user: UserDTO
  ): Promise<TaggedFiles | null> => {
    const client = await this.pool.connect();
    try {
      const query = this.sqlManager.getQuery('getFilesByUser');
      dataLogger.debug(query);
      const queryExecution = await client.query(query, [user.id]);
      return queryExecution.rows.map((row) => {
        const taggedFile = TaggedFileDTO.fromJSON(row);
        if (taggedFile.tags?.title) {
          return taggedFile;
        }
        taggedFile.tags = null;
        return taggedFile;
      });
    } catch (err) {
      dataLogger.error(`FilesRepository.getFilesByUser: ${err}`);
      return null;
    } finally {
      dataLogger.trace('FilesRepository.getFilesByUser: client.release()');
      client.release();
    }
  };

  public getFileSources = async (): Promise<FileSourcesDTO | null> => {
    const client = await this.pool.connect();
    try {
      const query = this.sqlManager.getQuery('getFileSources');
      dataLogger.debug(query);
      const queryExecution = await client.query(query);
      return queryExecution.rows.map((row) => FileSourceDTO.fromJSON(row));
    } catch (err) {
      dataLogger.error(`FilesRepository.getSources: ${err}`);
      return null;
    } finally {
      client.release();
    }
  };

  public getTagSources = async (
    description: string,
    client: pg.PoolClient
  ): Promise<TagSourceDTO> => {
    try {
      const query = this.sqlManager.getQuery('getTagSources');
      const queryExecution = await client.query(query, [description]);
      return TagSourceDTO.fromJSON(queryExecution.rows[0]);
    } catch (err) {
      dataLogger.error(`FilesRepository.getFileSourceId: ${err}`);
      throw new Error('File source not found');
    }
  };

  public insertFile = async (
    file: FileDTO,
    client: pg.PoolClient
  ): Promise<FileDTO> => {
    try {
      const query = this.sqlManager.getQuery('insertFile');
      const queryExecution = await client.query(query, [
        file.path,
        file.sourceUrl,
        file.source.id,
        file.status,
      ]);
      return FileDTO.fromJSON(queryExecution.rows[0]);
    } catch (err) {
      dataLogger.error(`FilesRepository.insertFileRecord: ${err}`);
      throw new Error('File not inserted');
    }
  };

  public insertUserFile = async (
    userId: number,
    fileId: number,
    client: pg.PoolClient
  ): Promise<void> => {
    try {
      const query = 'INSERT INTO user_files (user_id, file_id) VALUES ($1, $2)';
      await client.query(query, [userId, fileId]);
    } catch (err) {
      dataLogger.error(`FilesRepository.insertUserFileRecord: ${err}`);
    }
  };

  public insertFileTransaction = async (
    file: FileDTO,
    user: UserDTO
  ): Promise<File> => {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      try {
        const recordFile = await this.insertFile(file, client);
        await this.insertUserFile(user.id, recordFile.id, client);
        await client.query('COMMIT');
        return new File(
          recordFile.id,
          recordFile.path,
          new FileSource(
            recordFile.source.id,
            recordFile.source.description,
            recordFile.source.logoPath
          ),
          recordFile.status,
          recordFile.sourceUrl
        );
      } catch (err) {
        await client.query('ROLLBACK');
        dataLogger.error(`FilesRepository.insertFileRecord: ${err}. ROLLBACK`);
        throw new Error('File not inserted');
      }
    } catch (err) {
      dataLogger.error(`FilesRepository.insertFileRecord: ${err}`);
      throw new Error('File not inserted');
    } finally {
      dataLogger.trace('FilesRepository.insertFileRecord: client.release()');
      client.release();
    }
  };

  public getPictureBySourceId = async (
    sourceId: string
  ): Promise<FileSourceDTO | null> => {
    const client = await this.pool.connect();
    try {
      const query = this.sqlManager.getQuery('getPictureBySourceId');
      const queryExecution = await client.query(query, [sourceId]);
      return FileSourceDTO.fromJSON(queryExecution.rows[0]) || null;
    } catch (err) {
      dataLogger.error(`FilesRepository.getFileSourceById: ${err}`);
      return null;
    } finally {
      client.release();
    }
  };

  public getSourceIdByDescription = async (
    description: string
  ): Promise<number> => {
    const client = await this.pool.connect();
    try {
      const query = this.sqlManager.getQuery('getSourceIdByDescription');
      const queryExecution = await client.query(query, [description]);
      return queryExecution.rows[0].id;
    } catch (err) {
      dataLogger.error(`FilesRepository.getSourceIdByDescription: ${err}`);
      throw new Error('File source not found');
    } finally {
      client.release();
    }
  };
}
