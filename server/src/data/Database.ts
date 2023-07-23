import pg from 'pg';
import { IDatabase } from '@src/interfaces/iDatabase';
import { User } from '@src/entities/user';
import { AcceessToken } from '@src/entities/accessToken';
import { RefreshToken } from '@src/entities/refreshToken';
import { dataLogger } from '@src/utils/server/logger';

export class Database implements IDatabase {
  public pool: pg.Pool;
  constructor(pool: pg.Pool) {
    this.pool = pool;
  }

  public findUserByName = async (username: string) => {
    let client = null;
    try {
      client = await this.pool.connect();
      const query = `SELECT * FROM users WHERE name = $1`;
      const res = await client.query(query, [username]);
      dataLogger.debug(query);
      if (res == null || res.rows.length === 0) {
        return null;
      }
      return User.fromJSON(res.rows[0]);
    } catch (err: any) {
      dataLogger.error(err.stack);
      return null;
    } finally {
      if (client != null) {
        client.release();
      }
    }
  };

  public findUserById = async (id: number) => {
    let client = null;
    try {
      client = await this.pool.connect();
      const query = 'SELECT * FROM users WHERE id = $1';
      const res = await client.query(query, [id]);
      dataLogger.debug(query);
      if (res == null || res.rows.length === 0) {
        return null;
      }
      return User.fromJSON(res.rows[0]);
    } catch (err: any) {
      dataLogger.error(err.stack);
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
    } catch (err: any) {
      dataLogger.error(err.stack);
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
      const query = 'SELECT * FROM tokens WHERE token = $1';
      const res = await client.query(query, [token]);
      dataLogger.debug(query);
      if (res == null || res.rows.length === 0) {
        return null;
      }
      return AcceessToken.fromJSON(res.rows[0]);
    } catch (err: any) {
      dataLogger.error(err.stack);
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
    } catch (err: any) {
      dataLogger.error(err.stack);
      return null;
    } finally {
      if (client != null) {
        client.release();
      }
    }
  };

  public findTokenById = async (id: number) => {
    let client = null;
    try {
      client = await this.pool.connect();
      const query = 'SELECT * FROM tokens WHERE id = $1';
      const res = await client.query(query, [id]);
      dataLogger.debug(query);
      if (res == null || res.rows.length === 0) {
        return null;
      }
      return AcceessToken.fromJSON(res.rows[0]);
    } catch (err: any) {
      dataLogger.error(err.stack);
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
      const query = 'SELECT * FROM tokens WHERE refresh_token_id = $1';
      const res = await client.query(query, [tokenId]);
      dataLogger.debug(query);
      if (res == null || res.rows.length === 0) {
        return null;
      }
      return AcceessToken.fromJSON(res.rows[0]);
    } catch (err: any) {
      dataLogger.error(err.stack);
      return null;
    } finally {
      if (client != null) {
        client.release();
      }
    }
  };

  public insertRefreshToken = async (refreshToken: string, userId: number) => {
    let client = null;
    try {
      client = await this.pool.connect();
      const query =
        'INSERT INTO refresh_tokens (token, user_id) VALUES ($1, $2) RETURNING id';
      const res = await client.query(query, [refreshToken, userId]);
      dataLogger.debug(query);
      if (res == null || res.rows.length === 0) {
        return null;
      }
      return res.rows[0].id;
    } catch (err: any) {
      dataLogger.error(err.stack);
      return null;
    } finally {
      if (client != null) {
        client.release();
      }
    }
  };

  public insertAccessToken = async (
    userId: number,
    accessToken: string,
    refreshTokenId: number
  ) => {
    let client = null;
    try {
      client = await this.pool.connect();
      const query =
        'INSERT INTO tokens (user_id, token, refresh_token_id) VALUES ($1, $2, $3)';
      const res = await client.query(query, [
        userId,
        accessToken,
        refreshTokenId,
      ]);
      dataLogger.debug(query);
      if (res == null || res.rows.length === 0) {
        return null;
      }
      return res.rows[0].id;
    } catch (err: any) {
      dataLogger.error(err.stack);
      return null;
    } finally {
      if (client != null) {
        client.release();
      }
    }
  };

  public deleteAccessToken = async (token: string) => {
    let client = null;
    try {
      client = await this.pool.connect();
      const query = 'DELETE FROM tokens WHERE token = $1';
      await client.query(query, [token]);
      dataLogger.debug(query);
    } catch (err: any) {
      dataLogger.error(err.stack);
    } finally {
      if (client != null) {
        client.release();
      }
    }
  };

  public deleteRefreshToken = async (token: string) => {
    let client = null;
    try {
      client = await this.pool.connect();
      const query = 'DELETE FROM refresh_tokens WHERE token = $1';
      await client.query(query, [token]);
      dataLogger.debug(query);
    } catch (err: any) {
      dataLogger.error(err.stack);
    } finally {
      if (client != null) {
        client.release();
      }
    }
  };
}
