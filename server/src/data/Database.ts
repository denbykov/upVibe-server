import pg from "pg";
import { IDatabase } from "@src/interfaces/iDatabase";
import { User } from "@src/entities/user";
import { Token, RefreshToken } from "@src/entities/token";
import { serverLogger } from "@src/utils/server/logger";

const parseConfig = (config: JSON.JSONObject) => {
  const _config = {
    user: config.dbUser,
    host: config.dbHost,
    database: config.dbName,
    port: parseInt(config.dbPort),
    password: config.dbPasswrd,
    max: parseInt(config.dbMax),
  };
  return _config;
};

export class Database implements IDatabase {
  public config: Database.DBClientConfig;
  public client: Promise<pg.PoolClient>;
  constructor(config: JSON.JSONObject) {
    this.config = parseConfig(config);
    this.client = new Promise((resolve, reject) => {
      const pool = new pg.Pool(this.config);
      resolve(pool.connect());
      reject("Error connecting to database");
    });
  }
  public query = async (field: string, values?: Database.DBValue[]) => {
    try {
      const client = await this.client;
      const res = await client.query(field, values);
      return res;
    } catch (err: any) {
      serverLogger.error(err.stack);
      return null;
    }
  };

  public findUserByName = async (username: string) => {
    const res = await this.query("SELECT * FROM users WHERE name = $1", [
      username,
    ]);
    if (res == null || res.rows.length === 0) {
      return null;
    }
    return User.fromJSON(res.rows[0]);
  };

  public findUserById = async (id: number) => {
    const res = await this.query("SELECT * FROM users WHERE id = $1", [id]);
    if (res == null || res.rows.length === 0) {
      return null;
    }
    return User.fromJSON(res.rows[0]);
  };

  public findRefreshTokenId = async (refreshToken: string) => {
    const res = await this.query(
      "SELECT id FROM refresh_tokens WHERE token = $1",
      [refreshToken]
    );
    if (res == null || res.rows.length === 0) {
      return null;
    }
    return res.rows[0].id;
  };

  public findToken = async (token: string, type: string) => {
    if (type === "access") {
      const res = await this.query("SELECT * FROM tokens WHERE token = $1", [
        token,
      ]);
      if (res == null || res.rows.length === 0) {
        return null;
      }
      return Token.fromJSON(res.rows[0]);
    } else if (type === "refresh") {
      const res = await this.query(
        "SELECT * FROM refresh_tokens WHERE token = $1",
        [token]
      );
      if (res == null || res.rows.length === 0) {
        return null;
      }
      return RefreshToken.fromJSON(res.rows[0]);
    }
    return null;
  };

  public findTokenById = async (id: number) => {
    const res = await this.query("SELECT * FROM tokens WHERE id = $1", [id]);

    if (res == null || res.rows.length === 0) {
      return null;
    }

    return Token.fromJSON(res.rows[0]);
  };

  public findTokenByRefreshToken = async (tokenId: number) => {
    const res = await this.query(
      "SELECT * FROM tokens WHERE refresh_token_id = $1",
      [tokenId]
    );
    if (res == null || res.rows.length === 0) {
      return null;
    }
    return Token.fromJSON(res.rows[0]);
  };

  public insertRefreshToken = async (refreshToken: string) => {
    const res = await this.query(
      "INSERT INTO refresh_tokens (token) VALUES ($1) RETURNING id",
      [refreshToken]
    );
    if (res == null) {
      return null;
    }
    return res.rows[0].id;
  };

  public insertToken = async (
    userId: number,
    accessToken: string,
    refreshTokenId: number
  ) => {
    await this.query(
      "INSERT INTO tokens (user_id, token, refresh_token_id) VALUES ($1, $2, $3)",
      [userId, accessToken, refreshTokenId]
    );
  };

  public updateToken = async (refreshTokenId: number, accessToken: string) => {
    await this.query(
      "UPDATE tokens SET token = $1 WHERE refresh_token_id = $2",
      [accessToken, refreshTokenId]
    );
  };

  public deleteToken = async (token: string, typeToken: string) => {
    if (typeToken === "access") {
      await this.query("DELETE FROM tokens WHERE token = $1", [token]);
      serverLogger.info(`Token ${token} deleted`);
    } else if (typeToken === "refresh") {
      const tokenId = await this.findRefreshTokenId(token);
      await this.query("DELETE FROM tokens WHERE refresh_token_id = $1", [
        tokenId,
      ]);
      await this.query("DELETE FROM refresh_tokens WHERE id = $1", [tokenId]);
      serverLogger.info(`Token ${token} deleted`);
    }
  };

  public closeConnection = async () => {
    const client = await this.client;
    client.release();
  };
}
