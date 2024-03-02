import pg from 'pg';

import { TagSourceDTO } from '@src/dto/source';
import { TagDTO } from '@src/dto/tag';
import { iTagDatabase } from '@src/interfaces/iTagDatabase';
import { dataLogger } from '@src/utils/server/logger';

export class TagRepository implements iTagDatabase {
  public pool: pg.Pool;
  constructor(pool: pg.Pool) {
    this.pool = pool;
  }
  public getFileTags = async (fileId: number): Promise<TagDTO | null> => {
    const client = await this.pool.connect();
    try {
      const query =
        'SELECT t.id, t.file_id, t.title, t.artist, t.album, t.picture_path, t.year,' +
        't.track_number, ts.id as source_type_id, ts.description as source_type_description,' +
        'tss.status as status, tss.description as status_description ' +
        'FROM tags as t ' +
        'JOIN tag_sources as ts ' +
        'ON t.source_type = ts.id ' +
        'JOIN tag_statuses as tss ' +
        'ON t.status = tss.status ' +
        'WHERE file_id = $1';
      dataLogger.debug(query);
      const result = await client.query(query, [fileId]);
      if (result.rowCount === 0) {
        return null;
      }
      const row = result.rows[0];
      return TagDTO.fromJSON(row);
    } catch (err) {
      dataLogger.error(err);
      throw err;
    } finally {
      client.release();
    }
  };

  public getFilePictureTag = async (tagId: number): Promise<string | null> => {
    const client = await this.pool.connect();
    try {
      const query =
        'SELECT st.image_path FROM tags JOIN tag_sources as st ON tags.source_type=st.id WHERE tags.id = $1';
      dataLogger.debug(query);
      const result = await client.query(query, [tagId]);
      if (result.rowCount === 0) {
        return null;
      }
      const row = result.rows[0];
      return row.picture_path;
    } catch (err) {
      dataLogger.error(err);
      throw err;
    } finally {
      client.release();
    }
  };

  public getTagSources = async (): Promise<TagSourceDTO[] | null> => {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT  * FROM tag_sources ORDER BY id ASC';
      dataLogger.debug(query);
      const result = await client.query(query);
      if (result.rowCount === 0) {
        return null;
      }
      const rows = result.rows;
      const sources: TagSourceDTO[] = [];
      rows.forEach((row) => {
        sources.push(TagSourceDTO.fromJSON(row));
      });
      return sources;
    } catch (err) {
      dataLogger.error(err);
      throw err;
    } finally {
      client.release();
    }
  };

  public getTagSourcePicture = async (
    sourceId: number
  ): Promise<string | null> => {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT picture_path FROM tags WHERE source_type = $1';
      dataLogger.debug(query);
      const result = await client.query(query, [sourceId]);
      if (result.rowCount === 0) {
        return null;
      }
      const row = result.rows[0];
      return row.picture_path;
    } catch (err) {
      dataLogger.error(err);
      throw err;
    } finally {
      client.release();
    }
  };
}
