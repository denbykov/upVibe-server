import { LoginRequest } from "@src/entities/user";
import { IDatabase } from "@src/interfaces/iDatabase";
import { serverLogger } from "@src/utils/server/logger";
import jwt from "jsonwebtoken";

export class AuthWorker {
  private db: IDatabase;
  private config: JSON.JSONObject;
  constructor(db: IDatabase, config: JSON.JSONObject) {
    this.db = db;
    this.config = config;
    serverLogger.trace("AuthWorker initialized");
  }

  public verifyExpiredToken = (token: string, tokenType: string): Boolean => {
    const secret =
      tokenType === "access"
        ? this.config.apiAccessTokenSecret
        : this.config.apiRefreshTokenSecret;
    let verify: Boolean = true;
    jwt.verify(token, secret, (err: any) => {
      if (err) {
        serverLogger.info(`Error verifying token: ${err}`);
        if (err === "TokenExpiredError") {
          verify = false;
        }
        verify = false;
      }
    });
    return verify;
  };

  public login = async (LoginRequest: LoginRequest) => {
    const { name, password } = LoginRequest;
    const user = await this.db.findUserByName(name);
    if (!user) {
      serverLogger.error("User not found");
      return null;
    }
    if (user.password !== password) {
      serverLogger.error("Password invalid");
      return null;
    }
    const accessToken = jwt.sign(
      { id: user.id },
      this.config.apiAccessTokenSecret,
      {
        expiresIn: this.config.apiAccesTokenSecretExpires,
      }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      this.config.apiRefreshTokenSecret,
      {
        expiresIn: this.config.apiRefreshTokenSecretExpires,
      }
    );
    try {
      const refreshTokenId = await this.db.insertRefreshToken(refreshToken);
      await this.db.insertToken(user.id, accessToken, refreshTokenId);
    } catch (err) {
      serverLogger.error("Error inserting token");
      throw new Error("Error inserting token");
    } finally {
      serverLogger.trace("AuthWorker destroying");
      this.db.closeConnection();
    }
    return {
      accessToken,
      refreshToken,
    };
  };

  public refreshToken = async (refreshToken: string) => {
    const refreshTokenId = await this.db.findRefreshTokenId(refreshToken);
    if (!refreshTokenId) {
      serverLogger.error("Refresh token not found");
      return null;
    }
    if (!this.verifyExpiredToken(refreshToken, "refresh")) {
      try {
        await this.db.deleteToken(refreshToken, "refresh");
      } catch (err) {
        serverLogger.error("Error deleting token");
      } finally {
        serverLogger.trace("AuthWorker.refreshToken completed");
        this.db.closeConnection();
      }
      serverLogger.error("Refresh token expired");
      return null;
    }
    const token = await this.db.findTokenByRefreshToken(refreshTokenId);
    if (this.verifyExpiredToken(<string>token?.token, "access")) {
      serverLogger.error("Access token not expired");
      return null;
    }

    const user = await this.db.findUserById(<number>token?.userId);
    const newToken = jwt.sign(
      { id: user?.id },
      this.config.apiAccessTokenSecret,
      {
        expiresIn: this.config.apiAccesTokenSecretExpires,
      }
    );

    try {
      await this.db.updateToken(refreshTokenId, newToken);
    } catch (err) {
      serverLogger.error("Error updating token");
      throw new Error("Error updating token");
    } finally {
      serverLogger.trace("AuthWorker.refreshToken completed");
      this.db.closeConnection();
    }
    return {
      accessToken: newToken,
    };
  };

  public auth = async (token: string): Promise<Boolean> => {
    const tokenObj = await this.db.findToken(token, "access");
    if (!tokenObj) {
      serverLogger.error("Access token not found");
      return false;
    }
    if (!this.verifyExpiredToken(token, "access")) {
      try {
        await this.db.deleteToken(token, "access");
      } catch (err) {
        serverLogger.error("Error deleting token");
      } finally {
        serverLogger.trace("AuthWorker.auth completed");
        this.db.closeConnection();
      }
      serverLogger.error("Access token expired");
      return false;
    }
    serverLogger.trace("AuthWorker.auth completed");
    this.db.closeConnection();
    return true;
  };
}
