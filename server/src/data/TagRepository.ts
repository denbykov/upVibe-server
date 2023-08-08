import pg from 'pg';

import { TagSource } from '@src/entities/source';
import { Tag } from '@src/entities/tag';
import { iTagDatabase } from '@src/interfaces/iTagDatabase';
import { dataLogger } from '@src/utils/server/logger';

export class TagRepository implements iTagDatabase {
  public pool: pg.Pool;
  constructor(pool: pg.Pool) {
    this.pool = pool;
  }
  public getFileTags = async (fileId: number): Promise<Tag | null> => {
    const client = await this.pool.connect();
    try {
      const query =
        'SELECT t.id, t.file_id, t.title, t.artist, t.album, t.picture_path, t.year,' +
        't.track_number, ts.id as source_type_id, ts.description as source_type_description,' +
        'tss.id as status_id, tss.description as status_description ' +
        'FROM tags as t ' +
        'JOIN tag_sources as ts ' +
        'ON t.source_type = ts.id ' +
        'JOIN tag_statuses as tss ' +
        'ON t.status_id = tss.id ' +
        'WHERE file_id = $1';
      dataLogger.debug(query);
      const result = await client.query(query, [fileId]);
      if (result.rowCount === 0) {
        return null;
      }
      const row = result.rows[0];
      return Tag.fromJSON(row);
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
      const query = 'SELECT picture_path FROM tags WHERE id = $1';
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

  public getTagSources = async (): Promise<TagSource[] | null> => {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT  * FROM tag_sources ORDER BY id ASC';
      dataLogger.debug(query);
      const result = await client.query(query);
      if (result.rowCount === 0) {
        return null;
      }
      const rows = result.rows;
      const sources: TagSource[] = [];
      rows.forEach((row) => {
        sources.push(TagSource.fromJSON(row));
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
