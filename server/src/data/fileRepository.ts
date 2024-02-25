import pg from 'pg';

import { mapFiles } from '@src/business/mapFiles';
import { FileSources } from '@src/dto/file';
import { MappingFiles } from '@src/dto/mappingFiles';
import { File } from '@src/entities/file';
import { FileSource, TagSource } from '@src/entities/source';
import { User } from '@src/entities/user';
import { iFileDatabase } from '@src/interfaces/iFileDatabase';
import { dataLogger } from '@src/utils/server/logger';

import { GET_FILES_BY_USER_ID } from './queries';

export class FileRepository implements iFileDatabase {
  public pool: pg.Pool;
  constructor(pool: pg.Pool) {
    this.pool = pool;
  }

  public getFileByUrl = async (url: string): Promise<File | null> => {
    const client = await this.pool.connect();
    try {
      const query =
        'SELECT files.id as file_id, ' +
        'files.path as file_path, ' +
        'file_sources.id as file_sources_id, ' +
        'files.source_url as file_sources_url, ' +
        'file_sources.description as file_sources_description, ' +
        'file_sources.logo_path as file_sources_logo_path, ' +
        'files.status as file_status ' +
        'FROM files ' +
        'INNER JOIN file_sources ON files.source_id = file_sources.id ' +
        'WHERE source_url = $1';
      dataLogger.debug(query);
      const queryExecution = await client.query(query, [url]);
      if (queryExecution.rows.length > 0) {
        return File.fromJSON(queryExecution.rows[0]);
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

  public getFilesByUser = async (user: User): Promise<MappingFiles> => {
    const client = await this.pool.connect();
    try {
      dataLogger.debug(GET_FILES_BY_USER_ID);
      const query = await client.query(GET_FILES_BY_USER_ID, [user.id]);
      return mapFiles(query);
    } catch (err) {
      dataLogger.error(`FilesRepository.getFilesByUser: ${err}`);
      return null;
    } finally {
      dataLogger.trace('FilesRepository.getFilesByUser: client.release()');
      client.release();
    }
  };

  public getFileSources = async (): Promise<FileSources | null> => {
    const client = await this.pool.connect();
    try {
      const query =
        'SELECT id as file_sources_id, ' +
        'description as file_sources_description, ' +
        'logo_path as file_sources_logo_path ' +
        'FROM file_sources';
      dataLogger.debug(query);
      const queryExecution = await client.query(query);
      return queryExecution.rows.map((row) => FileSource.fromJSON(row));
    } catch (err) {
      dataLogger.error(`FilesRepository.getSources: ${err}`);
      return null;
    } finally {
      client.release();
    }
  };

  public getFileSource = async (
    description: string,
    client: pg.PoolClient
  ): Promise<FileSource> => {
    try {
      const query =
        'SELECT id as file_sources_id, ' +
        'description as file_sources_description, ' +
        'logo_path as file_sources_logo_path ' +
        'FROM file_sources ' +
        'WHERE description = $1';
      dataLogger.debug(query);
      const queryExecution = await client.query(query, [description]);
      return FileSource.fromJSON(queryExecution.rows[0]);
    } catch (err) {
      dataLogger.error(`FilesRepository.getFileSourceId: ${err}`);
      throw new Error('File source not found');
    }
  };

  public getTagSources = async (
    description: string,
    client: pg.PoolClient
  ): Promise<TagSource> => {
    try {
      const query =
        'SELECT tag_sources.id as tag_sources_id, ' +
        'tag_sources.description as tag_sources_description, ' +
        'tag_sources.logo_path as tag_sources_logo_path ' +
        'FROM tag_sources ' +
        'WHERE tag_sources.description = $1';
      const queryExecution = await client.query(query, [description]);
      return TagSource.fromJSON(queryExecution.rows[0]);
    } catch (err) {
      dataLogger.error(`FilesRepository.getFileSourceId: ${err}`);
      throw new Error('File source not found');
    }
  };

  public insertFile = async (
    file: File,
    sourceId: number,
    client: pg.PoolClient
  ): Promise<File> => {
    try {
      const query =
        'INSERT INTO files (path, source_url, source_id, status) ' +
        'VALUES ($1, $2, $3, $4) RETURNING id as file_id, ' +
        'path as file_path, source_url as file_source_url, ' +
        'source_id as file_source_id, status as file_status';
      const queryExecution = await client.query(query, [
        file.path,
        file.source.url,
        sourceId,
        file.status,
      ]);
      return File.fromJSON(queryExecution.rows[0]);
    } catch (err) {
      dataLogger.error(`FilesRepository.insertFileRecord: ${err}`);
      throw new Error('File not inserted');
    }
  };

  public insertFileTagMapping = async (
    fileId: number,
    userId: number,
    sourceId: number,
    client: pg.PoolClient
  ): Promise<void> => {
    try {
      const query =
        'INSERT INTO tag_mappings (file_id, user_id, title, ' +
        'artist, album, picture, year, track_number) VALUES ' +
        '($1, $2, $3, $3, $3, $3, $3, $3)';
      await client.query(query, [fileId, userId, sourceId]);
    } catch (err) {
      dataLogger.error(`FilesRepository.insertFileTagMapping: ${err}`);
      throw new Error('File tag not inserted');
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
    file: File,
    user: User
  ): Promise<File> => {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      try {
        const source = await this.getFileSource(
          file.source.description,
          client
        );
        const fileSourceId = source.id;
        const sourceLogoPath = source.logoPath;
        const insertFile = await this.insertFile(file, fileSourceId, client);
        const newFile = new File(
          insertFile.id,
          insertFile.path,
          new FileSource(
            fileSourceId,
            file.source.url,
            file.source.description,
            sourceLogoPath
          ),
          insertFile.status
        );
        await this.insertUserFile(user.id, newFile.id, client);
        await client.query('COMMIT');
        return newFile;
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
  ): Promise<FileSource | null> => {
    const client = await this.pool.connect();
    try {
      const query =
        'SELECT logo_path as file_sources_logo_path FROM file_sources WHERE id = $1';
      const queryExecution = await client.query(query, [sourceId]);
      return FileSource.fromJSON(queryExecution.rows[0]) || null;
    } catch (err) {
      dataLogger.error(`FilesRepository.getFileSourceById: ${err}`);
      return null;
    } finally {
      client.release();
    }
  };
}
