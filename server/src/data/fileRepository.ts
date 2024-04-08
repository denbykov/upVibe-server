import pg from 'pg';

import { FileDTO } from '@src/dto/fileDTO';
import { MappingDTO } from '@src/dto/mappingDTO';
import { TaggedFileDTO } from '@src/dto/taggedFileDTO';
import { UserDTO } from '@src/dto/userDTO';
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

  public getFileByUrl = async (url: string): Promise<FileDTO | null> => {
    const client = await this.pool.connect();
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
    const client = await this.pool.connect();
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
    const client = await this.pool.connect();
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
    const client = await this.pool.connect();
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
    userId: number,
    fileId: number
  ): Promise<void> => {
    const client = await this.pool.connect();
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

  public doesFileExist = async (fileId: number): Promise<boolean> => {
    const client = await this.pool.connect();
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
    userId: number,
    fileId: number
  ): Promise<boolean> => {
    const client = await this.pool.connect();
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
    id: number,
    userId: number
  ): Promise<TaggedFileDTO> => {
    const client = await this.pool.connect();
    try {
      const query = this.sqlManager.getQuery('getTaggedFile');
      const queryResult = await client.query(query, [id, userId]);
      return TaggedFileDTO.fromJSON(queryResult.rows[0]);
    } catch (err) {
      throw new Error(`FilesRepository.getTaggedFile: ${err}`);
    } finally {
      client.release();
    }
  };

  public getTaggedFileAndMapping = async (
    id: number,
    userId: number
  ): Promise<MappingDTO> => {
    const client = await this.pool.connect();
    try {
      const query = this.sqlManager.getQuery('getTaggedFileAndMapping');
      const queryResult = await client.query(query, [id, userId]);
      return MappingDTO.fromJSON(queryResult.rows[0]);
    } catch (err) {
      throw new Error(`FilesRepository.getTaggedFileAndMapping: ${err}`);
    } finally {
      client.release();
    }
  };
}
