import pg from 'pg';

import { File } from '@src/entities/file';
import { Response } from '@src/entities/response';
import { FileSource } from '@src/entities/source';
import { Tag } from '@src/entities/tag';
import { UnionFileTag } from '@src/entities/unionFileTag';
import { User } from '@src/entities/user';
import { iFileDatabase } from '@src/interfaces/iFileDatabase';
import { dataLogger } from '@src/utils/server/logger';

import {
  GET_FILES_BY_USER,
  GET_FILE_BY_ID,
  GET_FILE_BY_URL,
  GET_FILE_SOURCE,
  GET_FILE_SOURCES,
  GET_PICTURE_BY_SOURCE_ID,
  INSERT_FILE_RECORD,
  INSERT_USER_FILE_RECORD,
} from './queries';

export class FileRepository implements iFileDatabase {
  public pool: pg.Pool;
  constructor(pool: pg.Pool) {
    this.pool = pool;
  }

  public getFileByUrl = async (url: string): Promise<File | null> => {
    const client = await this.pool.connect();
    try {
      dataLogger.debug(GET_FILE_BY_URL);
      const queryExecution = await client.query(GET_FILE_BY_URL, [url]);
      if (queryExecution.rows.length > 0) {
        return File.fromJSON(queryExecution.rows[0]);
      } else {
        return null;
      }
    } catch (err) {
      dataLogger.error(`FilesRepository.getFileByUrl: ${err}`);
      return null;
    }
  };

  public getFilesByUser = async (
    user: User
  ): Promise<UnionFileTag[] | null> => {
    const client = await this.pool.connect();
    try {
      dataLogger.debug(GET_FILES_BY_USER);
      const queryExecution = await client.query(GET_FILES_BY_USER, [user.id]);
      const unionFileTag: UnionFileTag[] = [];
      queryExecution.rows.forEach((row) => {
        unionFileTag.push(
          new UnionFileTag(File.fromJSON(row), Tag.fromJSON(row))
        );
      });
      return unionFileTag;
    } catch (err) {
      dataLogger.error(`FilesRepository.getFilesByUser: ${err}`);
      return null;
    } finally {
      client.release();
    }
  };

  public getFileById = async (fileId: string): Promise<UnionFileTag | null> => {
    const client = await this.pool.connect();
    try {
      dataLogger.debug(GET_FILE_BY_ID);
      const queryExecution = await client.query(GET_FILE_BY_ID, [fileId]);
      return new UnionFileTag(
        File.fromJSON(queryExecution.rows[0]),
        Tag.fromJSON(queryExecution.rows[0])
      );
    } catch (err) {
      dataLogger.error(`FilesRepository.getFileById: ${err}`);
      return null;
    } finally {
      client.release();
    }
  };

  public getFileSources = async (): Promise<FileSource[] | null> => {
    const client = await this.pool.connect();
    try {
      dataLogger.debug(GET_FILE_SOURCES);
      const queryExecution = await client.query(GET_FILE_SOURCES);
      const sources: FileSource[] = [];
      queryExecution.rows.forEach((row) => {
        sources.push(FileSource.fromJSON(row));
      });
      return sources;
    } catch (err) {
      dataLogger.error(`FilesRepository.getSources: ${err}`);
      return null;
    } finally {
      client.release();
    }
  };

  public getFileSource = async (description: string): Promise<FileSource> => {
    const client = await this.pool.connect();
    try {
      dataLogger.debug(GET_FILE_SOURCE);
      const queryExecution = await client.query(GET_FILE_SOURCE, [description]);
      return FileSource.fromJSON(queryExecution.rows[0]);
    } catch (err) {
      dataLogger.error(`FilesRepository.getFileSourceId: ${err}`);
      throw new Error('File source not found');
    } finally {
      client.release();
    }
  };

  public insertFileRecord = async (
    file: File,
    sourceId: number
  ): Promise<File> => {
    const client = await this.pool.connect();
    try {
      const queryExecution = await client.query(INSERT_FILE_RECORD, [
        file.path,
        file.source.url,
        sourceId,
        file.status,
      ]);
      return File.fromJSON(queryExecution.rows[0]);
    } catch (err) {
      dataLogger.error(`FilesRepository.insertFileRecord: ${err}`);
      throw new Error('File not inserted');
    } finally {
      client.release();
    }
  };

  public insertUserFileRecord = async (
    userId: number,
    fileId: number
  ): Promise<void | null> => {
    const client = await this.pool.connect();
    try {
      dataLogger.debug(INSERT_USER_FILE_RECORD);
      await client.query(INSERT_USER_FILE_RECORD, [userId, fileId]);
    } catch (err) {
      dataLogger.error(`FilesRepository.insertUserFileRecord: ${err}`);
    } finally {
      client.release();
    }
  };

  public insertTransactionFileRecord = async (
    file: File,
    user: User,
    downloadFileBySource: (file: File) => Promise<Response>
  ): Promise<Response> => {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      try {
        const source = await this.getFileSource(file.source.description);
        const sourceId = source.id;
        const sourceLogoPath = source.logoPath;
        const insertFile = await this.insertFileRecord(file, sourceId);
        const newFile = new File(
          insertFile.id,
          insertFile.path,
          new FileSource(
            sourceId,
            file.source.url,
            file.source.description,
            sourceLogoPath
          ),
          insertFile.status
        );
        await this.insertUserFileRecord(user.id, newFile.id);
        const response = await downloadFileBySource(newFile);
        await client.query('COMMIT');
        return response;
      } catch (err) {
        await client.query('ROLLBACK');
        dataLogger.error(`FilesRepository.insertFileRecord: ${err}. ROLLBACK`);
        return new Response(
          Response.Code.InternalServerError,
          'Server error',
          -1
        );
      }
    } catch (err) {
      dataLogger.error(`FilesRepository.insertFileRecord: ${err}`);
      return new Response(
        Response.Code.InternalServerError,
        'Server error',
        -1
      );
    } finally {
      client.release();
    }
  };

  public getPictureBySourceId = async (
    sourceId: string
  ): Promise<FileSource | null> => {
    const client = await this.pool.connect();
    try {
      dataLogger.debug(GET_PICTURE_BY_SOURCE_ID);
      const queryExecution = await client.query(GET_PICTURE_BY_SOURCE_ID, [
        sourceId,
      ]);
      return FileSource.fromJSON(queryExecution.rows[0]);
    } catch (err) {
      dataLogger.error(`FilesRepository.getFileSourceById: ${err}`);
      return null;
    } finally {
      client.release();
    }
  };
}
