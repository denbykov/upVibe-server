import pg from 'pg';

import { File } from '@src/entities/file';
import { Response } from '@src/entities/response';
import { User } from '@src/entities/user';
import { iFileDatabase } from '@src/interfaces/iFileDatabase';
import { dataLogger } from '@src/utils/server/logger';

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
    }
  };

  public getFileSource = async (
    description: string
  ): Promise<{
    id: number;
    logoPath: string;
  } | null> => {
    const client = await this.pool.connect();
    try {
      const query =
        'SELECT id, logo_path FROM file_sources WHERE description = $1';
      dataLogger.debug(query);
      const queryExecution = await client.query(query, [description]);
      return {
        id: queryExecution.rows[0].id,
        logoPath: queryExecution.rows[0].logo_path,
      };
    } catch (err) {
      dataLogger.error(`FilesRepository.getFileSourceId: ${err}`);
      return null;
    }
  };

  public insertFileRecord = async (
    file: File,
    sourceId: number
  ): Promise<File | null> => {
    const client = await this.pool.connect();
    try {
      const query =
        'INSERT INTO files (path, source_url, source_id, status) VALUES ($1, $2, $3, $4) RETURNING *';
      dataLogger.debug(query);
      const queryExecution = await client.query(query, [
        file.path,
        file.source.url,
        sourceId,
        file.status,
      ]);
      return File.fromJSON(queryExecution.rows[0]);
    } catch (err) {
      dataLogger.error(`FilesRepository.insertFileRecord: ${err}`);
      return null;
    }
  };

  public insertUserFileRecord = async (
    userId: number,
    fileId: number
  ): Promise<void | null> => {
    const client = await this.pool.connect();
    try {
      const query = 'INSERT INTO user_files (user_id, file_id) VALUES ($1, $2)';
      dataLogger.debug(query);
      await client.query(query, [userId, fileId]);
    } catch (err) {
      dataLogger.error(`FilesRepository.insertUserFileRecord: ${err}`);
      return null;
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
        const sourceId = source!.id;
        const sourceLogoPath = source!.logoPath;
        const insertFile = await this.insertFileRecord(file, sourceId);
        const newFile = new File(
          insertFile!.id,
          insertFile!.path,
          {
            id: sourceId,
            url: file.source.url,
            description: file.source.description,
            logoPath: sourceLogoPath,
          },
          insertFile!.status
        );
        await this.insertUserFileRecord(user.id, insertFile!.id);
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
    }
  };
}
