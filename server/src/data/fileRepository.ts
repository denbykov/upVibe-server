import pg from 'pg';

import { FileDTO } from '@src/dtos/fileDTO';
import { TaggedFileDTO } from '@src/dtos/taggedFileDTO';
import { UserDTO } from '@src/dtos/userDTO';
import { iFileDatabase } from '@src/interfaces/iFileDatabase';
import { SQLManager } from '@src/sqlManager';
import { dataLogger } from '@src/utils/server/logger';

export class FileRepository implements iFileDatabase {
  public dbPool: pg.Pool;
  public sqlManager: SQLManager;

  constructor(dbPool: pg.Pool, sqlManager: SQLManager) {
    this.dbPool = dbPool;
    this.sqlManager = sqlManager;
  }

  public getFileByUrl = async (url: string): Promise<FileDTO | null> => {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('getFileByUrl');
      dataLogger.debug(query);
      const queryResult = await client.query(query, [url]);
      if (queryResult.rows.length > 0) {
        const result = FileDTO.fromJSON(queryResult.rows[0]);
        return result;
      } else {
        return null;
      }
    } catch (err) {
      dataLogger.error(err);
      throw err;
    } finally {
      client.release();
    }
  };

  public getTaggedFileByUrl = async (
    url: string,
    user: UserDTO
  ): Promise<TaggedFileDTO | null> => {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('getTaggedFileByUrl');
      dataLogger.debug(query);
      const queryResult = await client.query(query, [url, user.id]);
      if (queryResult.rows.length > 0) {
        const result = TaggedFileDTO.fromJSON(queryResult.rows[0]);
        return result;
      } else {
        return null;
      }
    } catch (err) {
      dataLogger.error(err);
      throw err;
    } finally {
      client.release();
    }
  };

  public extendGetTaggedFilesByUser = (
    query: string,
    statuses: Array<string> | null,
    synchronized: boolean | null
  ): string => {
    let paramIndex = 3;

    if (statuses !== null) {
      query += ' AND f.status IN (';
      for (let i = 0; i < statuses.length; i++) {
        query += `$${paramIndex}`;
        paramIndex++;
        if (i < statuses.length - 1) {
          query += ', ';
        }
      }
      query += ')';
    }
    if (synchronized !== null) {
      query += ` AND fs.is_synchronized = $${paramIndex}`;
      paramIndex++;
    }
    return query;
  };

  public formGetTaggedFilesByUserParametersList = (
    user: UserDTO,
    deviceId: string,
    statuses: Array<string> | null,
    synchronized: boolean | null
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: Array<any> = [user.id, deviceId];
    if (statuses !== null) {
      params.push(...statuses);
    }
    if (synchronized !== null) {
      params.push(synchronized);
    }

    return params;
  };

  public getTaggedFilesByUser = async (
    user: UserDTO,
    deviceId: string,
    statuses: Array<string> | null,
    synchronized: boolean | null
  ): Promise<Array<TaggedFileDTO>> => {
    const client = await this.dbPool.connect();
    try {
      const query = this.extendGetTaggedFilesByUser(
        this.sqlManager.getQuery('getTaggedFilesByUser'),
        statuses,
        synchronized
      );

      dataLogger.debug(query);
      const queryResult = await client.query(
        query,
        this.formGetTaggedFilesByUserParametersList(
          user,
          deviceId,
          statuses,
          synchronized
        )
      );
      return queryResult.rows.map((row) => {
        return TaggedFileDTO.fromJSON(row);
      });
    } catch (err) {
      dataLogger.error(err);
      throw err;
    } finally {
      client.release();
    }
  };

  public insertFile = async (file: FileDTO): Promise<FileDTO> => {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('insertFile');
      const queryResult = await client.query(query, [
        file.path,
        file.sourceUrl,
        file.source,
        file.status,
      ]);
      return FileDTO.fromJSON(queryResult.rows[0]);
    } catch (err) {
      dataLogger.error(err);
      throw err;
    } finally {
      client.release();
    }
  };

  public insertUserFile = async (
    userId: string,
    fileId: string
  ): Promise<string> => {
    const client = await this.dbPool.connect();
    try {
      const query =
        'INSERT INTO user_files (user_id, file_id) VALUES ($1, $2) RETURNING id';
      const queryResult = await client.query(query, [userId, fileId]);
      return queryResult.rows[0].id;
    } catch (err) {
      dataLogger.error(err);
      throw err;
    } finally {
      client.release();
    }
  };

  public doesFileExist = async (fileId: string): Promise<boolean> => {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('doesFileExist');
      dataLogger.debug(query);
      const queryResult = await client.query(query, [fileId]);
      return queryResult.rows.length > 0;
    } catch (err) {
      dataLogger.error(`FilesRepository.doesFileExist: ${err}`);
      throw err;
    } finally {
      client.release();
    }
  };

  public doesUserFileExist = async (
    userId: string,
    fileId: string
  ): Promise<boolean> => {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('doesUserFileExist');
      dataLogger.debug(query);
      const queryResult = await client.query(query, [userId, fileId]);
      return queryResult.rows.length > 0;
    } catch (err) {
      dataLogger.error(`FilesRepository.doesUserFileExist: ${err}`);
      throw err;
    } finally {
      client.release();
    }
  };

  public getTaggedFile = async (
    id: string,
    deviceId: string,
    userId: string
  ): Promise<TaggedFileDTO | null> => {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('getTaggedFile');
      const queryResult = await client.query(query, [id, deviceId, userId]);
      if (queryResult.rows.length === 0) {
        return null;
      }
      return TaggedFileDTO.fromJSON(queryResult.rows[0]);
    } catch (err) {
      throw new Error(`FilesRepository.getTaggedFile: ${err}`);
    } finally {
      client.release();
    }
  };

  public insertSynchronizationRecords = async (
    userId: string,
    userFileId: string
  ): Promise<void> => {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('insertSynchronizationRecords');
      await client.query(query, [userId, userFileId]);
    } catch (err) {
      throw new Error(`FilesRepository.insertSynchronizationRecords: ${err}`);
    } finally {
      client.release();
    }
  };

  public confirmFile = async (
    fileId: string,
    userId: string,
    deviceId: string
  ): Promise<void> => {
    const client = await this.dbPool.connect();
    try {
      const query = this.sqlManager.getQuery('confirmFile');
      await client.query(query, [fileId, userId, deviceId]);
    } catch (err) {
      throw new Error(`FilesRepository.confirmFile: ${err}`);
    } finally {
      client.release();
    }
  };
}
