import pg from 'pg';

import { File } from '@src/entities/file';
import { Response } from '@src/entities/response';
import { FileSource, TagSource } from '@src/entities/source';
import { Status } from '@src/entities/status';
import { Tag } from '@src/entities/tag';
import { User } from '@src/entities/user';
import { iFileDatabase } from '@src/interfaces/iFileDatabase';
import { displayFile, displayFiles } from '@src/utils/server/displayFiles';
import { dataLogger } from '@src/utils/server/logger';

import { GET_FILES_BY_USER_ID, GET_FILE_BY_ID } from './queries';

export class FileRepository implements iFileDatabase {
  public pool: pg.Pool;
  constructor(pool: pg.Pool) {
    this.pool = pool;
  }

  public getFileByUrl = async (url: string): Promise<File | null> => {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT * FROM files WHERE source_url = $1';
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

  public getFilesByUser = async (
    user: User
  ): Promise<Array<
    Record<
      string,
      | number
      | string
      | Record<string, number | string>
      | Array<Record<string, number | string>>
    >
  > | null> => {
    const client = await this.pool.connect();
    try {
      dataLogger.debug(GET_FILES_BY_USER_ID);
      const query = await client.query(GET_FILES_BY_USER_ID, [user.id]);
      return displayFiles(query);
    } catch (err) {
      dataLogger.error(`FilesRepository.getFilesByUser: ${err}`);
      return null;
    } finally {
      dataLogger.trace('FilesRepository.getFilesByUser: client.release()');
      client.release();
    }
  };

  public getFileById = async (
    fileId: string
  ): Promise<Record<
    string,
    | string
    | number
    | Record<string, string | number>
    | Array<Record<string, string | number>>
  > | null> => {
    const client = await this.pool.connect();
    try {
      dataLogger.debug(GET_FILE_BY_ID);
      dataLogger.debug('FileRepository.getFileById()' + fileId);
      const queryExecution = await client.query(GET_FILE_BY_ID, [fileId]);
      return displayFile(queryExecution);
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

  public insertFileTag = async (
    tag: Tag,
    client: pg.PoolClient
  ): Promise<void> => {
    try {
      const query =
        'INSERT INTO tags (file_id, title, artist, album, picture_path, year, track_number, source, status) ' +
        'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
      await client.query(query, [
        tag.fileId,
        tag.title,
        tag.artist,
        tag.album,
        tag.picturePath,
        tag.year,
        tag.trackNumber,
        tag.sourceType.id,
        tag.status,
      ]);
    } catch (err) {
      dataLogger.error(`FilesRepository.insertFileTagRecord: ${err}`);
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

  public insertTransactionFile = async (
    file: File,
    user: User,
    downloadFileBySource: (file: File) => Promise<Response>
  ): Promise<Response> => {
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
        const tagSourceId = (
          await this.getTagSources(newFile.source.description, client)
        ).id;
        await this.insertFileTag(
          new Tag(
            0,
            newFile.id,
            'CR',
            'CR',
            'CR',
            'CR',
            0,
            0,
            new TagSource(tagSourceId, 'CR'),
            Status.Created
          ),
          client
        );
        await this.insertFileTagMapping(
          newFile.id,
          user.id,
          tagSourceId,
          client
        );
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
