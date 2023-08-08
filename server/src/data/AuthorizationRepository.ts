import pg from 'pg';

import { AccessToken } from '@src/entities/accessToken';
import { RefreshToken } from '@src/entities/refreshToken';
import { User } from '@src/entities/user';
import { IAuthorizationDatabase } from '@src/interfaces/iAuthorizationDatabase';
import { dataLogger } from '@src/utils/server/logger';

export class AuthorizationRepository implements IAuthorizationDatabase {
  public pool: pg.Pool;
  constructor(pool: pg.Pool) {
    this.pool = pool;
  }

  public findUserByName = async (name: string) => {
    let client = null;
    try {
      client = await this.pool.connect();
      const query = `SELECT * FROM users WHERE name = $1`;
      const res = await client.query(query, [name]);
      dataLogger.debug(query);
      if (res == null || res.rows.length === 0) {
        return null;
      }
      return User.fromJSON(res.rows[0]);
    } catch (err) {
      dataLogger.error(err);
      return null;
    } finally {
      if (client != null) {
        client.release();
      }
    }
  };

  public findRefreshTokenId = async (refreshToken: string) => {
    let client = null;
    try {
      client = await this.pool.connect();
      const query = 'SELECT id FROM refresh_tokens WHERE token = $1';
      const res = await client.query(query, [refreshToken]);
      dataLogger.debug(query);
      if (res == null || res.rows.length === 0) {
        return null;
      }
      return res.rows[0].id;
    } catch (err) {
      dataLogger.error(err);
      return null;
    } finally {
      if (client != null) {
        client.release();
      }
    }
  };

  public findAccessToken = async (token: string) => {
    let client = null;
    try {
      client = await this.pool.connect();
      const query = 'SELECT * FROM access_tokens WHERE token = $1';
      const res = await client.query(query, [token]);
      dataLogger.debug(query);
      if (res == null || res.rows.length === 0) {
        return null;
      }
      return AccessToken.fromJSON(res.rows[0]);
    } catch (err) {
      dataLogger.error(err);
      return null;
    } finally {
      if (client != null) {
        client.release();
      }
    }
  };

  public findRefreshToken = async (token: string) => {
    let client = null;
    try {
      client = await this.pool.connect();
      const query = 'SELECT * FROM refresh_tokens WHERE token = $1';
      const res = await client.query(query, [token]);
      dataLogger.debug(query);
      if (res == null || res.rows.length === 0) {
        return null;
      }
      return RefreshToken.fromJSON(res.rows[0]);
    } catch (err) {
      dataLogger.error(err);
      return null;
    } finally {
      if (client != null) {
        client.release();
      }
    }
  };

  public findAccessTokenByRefreshTokenId = async (tokenId: number) => {
    let client = null;
    try {
      client = await this.pool.connect();
      const query = 'SELECT * FROM access_tokens WHERE parent_id = $1';
      const res = await client.query(query, [tokenId]);
      dataLogger.debug(query);
      if (res == null || res.rows.length === 0) {
        return null;
      }
      return AccessToken.fromJSON(res.rows[0]);
    } catch (err) {
      dataLogger.error(err);
      return null;
    } finally {
      if (client != null) {
        client.release();
      }
    }
  };

  public insertRefreshToken = async (refreshToken: RefreshToken) => {
    let client = null;
    try {
      client = await this.pool.connect();
      const query =
        'INSERT INTO refresh_tokens (token, parent_id, user_id, common_ancestor_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING id';
      const res = await client.query(query, [
        refreshToken.token,
        refreshToken.parentId,
        refreshToken.userId,
        refreshToken.commonAncestorId,
        refreshToken.status,
      ]);
      dataLogger.debug(query);
      if (res == null || res.rows.length === 0) {
        dataLogger.error('Failed to insert refresh token');
        throw new Error('Failed to insert refresh token');
      }
      return res.rows[0].id;
    } catch (err) {
      dataLogger.error(err);
      throw new Error('Failed to insert access token');
    } finally {
      if (client != null) {
        client.release();
      }
    }
  };

  public insertAccessToken = async (accessToken: AccessToken) => {
    let client = null;
    try {
      client = await this.pool.connect();
      const query =
        'INSERT INTO access_tokens (token, parent_id, user_id) VALUES ($1, $2, $3) RETURNING id';
      const res = await client.query(query, [
        accessToken.token,
        accessToken.parentId,
        accessToken.userId,
      ]);
      dataLogger.debug(query);
      if (res == null || res.rows.length === 0) {
        dataLogger.error('Failed to insert access token');
        throw new Error('Failed to insert access token');
      }
      return res.rows[0].id;
    } catch (err) {
      dataLogger.error(err);
      throw new Error('Failed to insert access token');
    } finally {
      if (client != null) {
        client.release();
      }
    }
  };

  public updateRefreshToken = async (
    newRefreshToken: RefreshToken,
    refreshToken: RefreshToken
  ) => {
    let client = null;
    try {
      client = await this.pool.connect();
      await client.query('BEGIN');
      try {
        const query = 'UPDATE refresh_tokens SET status=$1 WHERE id = $2';
        await client.query(query, [refreshToken.status, refreshToken.id]);
        dataLogger.debug(query);
        const query2 =
          'INSERT INTO refresh_tokens (token, parent_id, user_id, common_ancestor_id, status)' +
          'VALUES ($1, $2, $3, $4, $5) RETURNING id';
        const executionResponse = await client.query(query2, [
          newRefreshToken.token,
          refreshToken.id,
          newRefreshToken.userId,
          refreshToken.commonAncestorId
            ? refreshToken.commonAncestorId
            : refreshToken.id,
          newRefreshToken.status,
        ]);
        dataLogger.debug(query2);
        const newRefreshTokenId = executionResponse.rows[0].id;
        const query3 =
          'UPDATE access_tokens SET parent_id = $1 WHERE parent_id = $2';
        await client.query(query3, [newRefreshTokenId, refreshToken.id]);
        dataLogger.debug(query3);
        await client.query('COMMIT');
        return newRefreshTokenId;
      } catch (e) {
        await client.query('ROLLBACK');
        dataLogger.error(e);
        throw new Error('Failed to update refresh token');
      }
    } catch (err) {
      dataLogger.error(err);
    } finally {
      if (client != null) {
        client.release();
      }
    }
  };

  public findRefreshTokenByParentId = async (parentId: number) => {
    let client = null;
    try {
      client = await this.pool.connect();
      const query = 'SELECT * FROM refresh_tokens WHERE parent_id = $1';
      const res = await client.query(query, [parentId]);
      dataLogger.debug(query);
      if (res == null || res.rows.length === 0) {
        return null;
      }
      return RefreshToken.fromJSON(res.rows[0]);
    } catch (err) {
      dataLogger.error(err);
      return null;
    } finally {
      if (client != null) {
        client.release();
      }
    }
  };

  public updateAccessToken = async (accessToken: AccessToken) => {
    let client = null;
    try {
      client = await this.pool.connect();
      const query = 'UPDATE access_tokens SET parent_id=$1 WHERE id = $3';
      await client.query(query, [accessToken.parentId, accessToken.id]);
      dataLogger.debug(query);
    } catch (err) {
      dataLogger.error(err);
    } finally {
      if (client != null) {
        client.release();
      }
    }
  };

  public deleteAccessToken = async (id: number) => {
    let client = null;
    try {
      client = await this.pool.connect();
      const query = 'DELETE FROM access_tokens WHERE id = $1';
      await client.query(query, [id]);
      dataLogger.debug(query);
    } catch (err) {
      dataLogger.error(err);
    } finally {
      if (client != null) {
        client.release();
      }
    }
  };

  public deleteRefreshToken = async (id: number) => {
    let client = null;
    try {
      client = await this.pool.connect();
      const query = 'DELETE FROM refresh_tokens WHERE id = $1';
      await client.query(query, [id]);
      dataLogger.debug(query);
      const query2 = 'DELETE FROM refresh_tokens WHERE common_ancestor_id = $1';
      await client.query(query2, [id]);
      dataLogger.debug(query2);
    } catch (err) {
      dataLogger.error(err);
    } finally {
      if (client != null) {
        client.release();
      }
    }
  };
}
