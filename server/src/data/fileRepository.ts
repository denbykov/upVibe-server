import pg from 'pg';

import { DBManager } from '@src/dbManager';
import { FileDTO } from '@src/dtos/fileDTO';
import { TaggedFileDTO } from '@src/dtos/taggedFileDTO';
import { UserDTO } from '@src/dtos/userDTO';
import { iFileDatabase } from '@src/interfaces/iFileDatabase';
import { SQLManager } from '@src/sqlManager';
import { dataLogger } from '@src/utils/server/logger';

export class FileRepository implements iFileDatabase {
  public dbManager: DBManager;
  public sqlManager: SQLManager;

  constructor(dbManager: DBManager, sqlManager: SQLManager) {
    this.dbManager = dbManager;
    this.sqlManager = sqlManager;
  }

  private buildPGPool = (): pg.Pool => {
    return this.dbManager.getPGPool();
  };

  public getFileByUrl = async (url: string): Promise<FileDTO | null> => {
    const client = await this.buildPGPool().connect();
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
    const client = await this.buildPGPool().connect();
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

  public getTaggedFilesByUser = async (
    user: UserDTO
  ): Promise<Array<TaggedFileDTO>> => {
    const client = await this.buildPGPool().connect();
    try {
      const query = this.sqlManager.getQuery('getTaggedFilesByUser');
      dataLogger.debug(query);
      const queryResult = await client.query(query, [user.id]);
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
    const client = await this.buildPGPool().connect();
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
  ): Promise<void> => {
    const client = await this.buildPGPool().connect();
    try {
      const query = 'INSERT INTO user_files (user_id, file_id) VALUES ($1, $2)';
      await client.query(query, [userId, fileId]);
    } catch (err) {
      dataLogger.error(err);
      throw err;
    } finally {
      client.release();
    }
  };

  public doesFileExist = async (fileId: string): Promise<boolean> => {
    const client = await this.buildPGPool().connect();
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
    const client = await this.buildPGPool().connect();
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
    userId: string
  ): Promise<TaggedFileDTO | null> => {
    const client = await this.buildPGPool().connect();
    try {
      const query = this.sqlManager.getQuery('getTaggedFile');
      const queryResult = await client.query(query, [id, userId]);
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
}
