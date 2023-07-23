import { LoginRequest } from '@src/entities/user';
import { IDatabase } from '@src/interfaces/iDatabase';
import { dataLogger } from '@src/utils/server/logger';
import jwt from 'jsonwebtoken';

export class AuthWorker {
  private db: IDatabase;
  private config: JSON.JSONObject;
  constructor(db: IDatabase, config: JSON.JSONObject) {
    this.db = db;
    this.config = config;
    dataLogger.trace('AuthWorker initialized');
  }

  public verifyExpiredAccessToken = (token: string): Boolean => {
    const secret = this.config.apiAccessTokenSecret;
    let verify: Boolean = true;
    jwt.verify(token, secret, (err: any) => {
      if (err) {
        dataLogger.info(`Error verifying token: ${err}`);
        if (err === 'TokenExpiredError') {
          verify = false;
        }
        verify = false;
      }
    });
    return verify;
  };

  public verifyExpiredRefreshToken = (token: string): Boolean => {
    const secret = this.config.apiRefreshTokenSecret;
    let verify: Boolean = true;
    jwt.verify(token, secret, (err: any) => {
      if (err) {
        dataLogger.info(`Error verifying token: ${err}`);
        if (err === 'TokenExpiredError') {
          verify = false;
        }
        verify = false;
      }
    });
    return verify;
  };

  public generateAccessToken = (userId: number): string => {
    const secret = this.config.apiAccessTokenSecret;
    const expiresIn = this.config.apiAccesTokenSecretExpires;
    const token = jwt.sign({ userId }, secret, {
      expiresIn,
    });
    return token;
  };

  public generateRefreshToken = (userId: number): string => {
    const secret = this.config.apiRefreshTokenSecret;
    const expiresIn = this.config.apiRefreshTokenSecretExpires;
    const token = jwt.sign({ userId }, secret, {
      expiresIn,
    });
    return token;
  };

  public login = async (LoginRequest: LoginRequest) => {
    const { name, password } = LoginRequest;
    const user = await this.db.findUserByName(name);
    if (!user) {
      dataLogger.error('User not found');
      return null;
    }
    if (user.password !== password) {
      dataLogger.error('Password invalid');
      return null;
    }

    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    try {
      const refreshTokenId = await this.db.insertRefreshToken(
        refreshToken,
        user.id
      );
      await this.db.insertAccessToken(user.id, accessToken, refreshTokenId);
    } catch (err) {
      dataLogger.error('Error inserting token');
      throw new Error('Error inserting token');
    } finally {
      dataLogger.trace('AuthWorker.login quitting');
    }
    return {
      accessToken,
      refreshToken,
    };
  };

  public getAccessToken = async (refreshToken: string) => {
    const tmpRefreshToken = await this.db.findRefreshToken(refreshToken);
    if (!tmpRefreshToken) {
      dataLogger.error('Refresh token not found');
      return null;
    }

    if (!this.verifyExpiredRefreshToken(refreshToken)) {
      try {
        await this.db.deleteRefreshToken(refreshToken);
      } catch (err) {
        dataLogger.error('Error deleting token');
      } finally {
        dataLogger.trace('AuthWorker.getAccessToken quitting');
      }
      dataLogger.error('Refresh token expired');
      return null;
    }
    const accessToken = await this.db.findAccessTokenByRefreshTokenId(
      <number>tmpRefreshToken.id
    );
    if (accessToken) {
      dataLogger.error('Access token found');
      this.db.deleteRefreshToken(refreshToken);
      return null;
    }
    const newAccessToken = this.generateAccessToken(
      <number>tmpRefreshToken.userId
    );
    try {
      await this.db.insertAccessToken(
        <number>tmpRefreshToken.userId,
        newAccessToken,
        <number>tmpRefreshToken.id
      );
    } catch (err) {
      dataLogger.error('Error inserting token');
      throw new Error('Error inserting token');
    } finally {
      dataLogger.trace('AuthWorker.getAccessToken quitting');
    }

    return newAccessToken;
  };

  public auth = async (token: string): Promise<Boolean> => {
    const tokenObj = await this.db.findAccessToken(token);
    if (!tokenObj) {
      dataLogger.error('Access token not found');
      return false;
    }
    if (!this.verifyExpiredAccessToken(token)) {
      try {
        await this.db.deleteAccessToken(token);
      } catch (err) {
        dataLogger.error('Error deleting token');
      } finally {
        dataLogger.trace('AuthWorker.auth completed');
      }
      dataLogger.error('Access token expired');
      return false;
    }
    dataLogger.trace('AuthWorker.auth quitting');
    return true;
  };
}
