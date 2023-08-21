/* eslint-disable @typescript-eslint/no-var-requires */
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

const { Config } = require('@src/entities/config');
const { AuthWorker } = require('@src/business/authWorker');
const {
  IAuthorizationDatabase,
} = require('@src/interfaces/iAuthorizationDatabase');
const { RefreshToken } = require('@src/entities/refreshToken');
const { AccessToken } = require('@src/entities/accessToken');
const { LoginRequest } = require('@src/entities/user');
const { Response } = require('@src/entities/response');

describe('AuthWorker', () => {
  let authWorker: typeof AuthWorker;
  let db: typeof IAuthorizationDatabase;
  let config: typeof Config;

  beforeEach(() => {
    db = {
      findUserByName: jest.fn(),
      findRefreshToken: jest.fn(),
      findAccessToken: jest.fn(),
      findAccessTokenByRefreshTokenId: jest.fn(),
      findRefreshTokenByParentId: jest.fn(),
      insertRefreshToken: jest.fn(),
      insertAccessToken: jest.fn(),
      updateRefreshToken: jest.fn(),
      deleteRefreshToken: jest.fn(),
      deleteAccessToken: jest.fn(),
    };
    config = {
      apiAccessTokenSecret: 'secret',
      apiRefreshTokenSecret: 'secret',
      apiAccesTokenSecretExpires: '1h',
      apiRefreshTokenSecretExpires: '1d',
    };
    authWorker = new AuthWorker(db, config);
  });

  describe('verifyAccessToken', () => {
    it('should return true for a valid token', () => {
      const token = authWorker.generateAccessToken(1);
      const result = authWorker.verifyAccessToken(token);
      expect(result).toBe(true);
    });

    it('should return false for an invalid token', () => {
      const token = 'invalid_token';
      const result = authWorker.verifyAccessToken(token);
      expect(result).toBe(false);
    });
  });

  describe('verifyRefreshToken', () => {
    it('should return true for a valid token', () => {
      const token = authWorker.generateRefreshToken(1);
      const result = authWorker.verifyRefreshToken(token);
      expect(result).toBe(true);
    });

    it('should return false for an invalid token', () => {
      const token = 'invalid_token';
      const result = authWorker.verifyRefreshToken(token);
      expect(result).toBe(false);
    });
  });

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      const userId = 1;
      const token = authWorker.generateAccessToken(userId);
      expect(token).toBeDefined();
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const userId = 1;
      const token = authWorker.generateRefreshToken(userId);
      expect(token).toBeDefined();
    });
  });

  describe('invalidateTokenTree', () => {
    it('should delete the refresh token and its children', async () => {
      const refreshToken = new RefreshToken(1, 'token', 2, 3, 4, 'A');
      await authWorker.invalidateTokenTree(refreshToken);
      expect(db.deleteRefreshToken).toHaveBeenCalledWith(4);
    });
  });

  describe('login', () => {
    it('should return a response with an access token and a refresh token', async () => {
      const loginRequest: typeof LoginRequest = {
        name: 'user',
        password: 'password',
      };
      const user = {
        id: 1,
        name: 'user',
        password: 'password',
      };
      db.findUserByName.mockResolvedValue(user);
      db.insertRefreshToken.mockResolvedValue(2);
      const response: typeof Response = await authWorker.login(loginRequest);
      expect(response.httpCode).toBe(Response.Code.Ok);
      expect(response.payload.accessToken).toBeDefined();
      expect(response.payload.refreshToken).toBeDefined();
    });

    it('should return a response with an error message if the user is not found', async () => {
      const loginRequest: typeof LoginRequest = {
        name: 'user',
        password: 'password',
      };
      db.findUserByName.mockResolvedValue(undefined);
      const response: typeof Response = await authWorker.login(loginRequest);
      expect(response.httpCode).toBe(Response.Code.Forbidden);
      expect(response.payload).toBe('User not found');
    });

    it('should return a response with an error message if the password is invalid', async () => {
      const loginRequest: typeof LoginRequest = {
        name: 'user',
        password: 'password',
      };
      const user = {
        id: 1,
        name: 'user',
        password: 'wrong_password',
      };
      db.findUserByName.mockResolvedValue(user);
      const response: typeof Response = await authWorker.login(loginRequest);
      expect(response.httpCode).toBe(Response.Code.Forbidden);
      expect(response.payload).toBe('Password invalid');
    });
  });

  describe('getAccessToken', () => {
    it('should return a response with an access token if the refresh token is valid', async () => {
      const refreshToken = authWorker.generateRefreshToken(1);
      const tmpRefreshToken = new RefreshToken(1, refreshToken, 2, 3, 4, 'A');
      db.findRefreshToken.mockResolvedValue(tmpRefreshToken);
      db.findAccessTokenByRefreshTokenId.mockResolvedValue(undefined);
      db.insertAccessToken.mockResolvedValue(undefined);
      const response: typeof Response = await authWorker.getAccessToken(
        refreshToken
      );
      expect(response.httpCode).toBe(Response.Code.Ok);
      expect(response.payload.accessToken).toBeDefined();
    });

    it('should return a response with an error message if the refresh token is not found', async () => {
      const refreshTokenId = 'invalid_token_id';
      const response: typeof Response = await authWorker.deleteRefreshToken(
        refreshTokenId
      );
      expect(response.code).toBe(1);
      expect(response.payload).toBe('RefreshToken is not found');
    });

    it('should return a response with an error message if the refresh token is expired', async () => {
      const refreshToken = 'expired_token';
      const tmpRefreshToken = new RefreshToken(1, refreshToken, 2, 3, 4, 'A');
      db.findRefreshToken.mockResolvedValue(tmpRefreshToken);
      authWorker.verifyRefreshToken = jest.fn().mockReturnValue(false);
      const response: typeof Response = await authWorker.getAccessToken(
        refreshToken
      );
      expect(response.httpCode).toBe(Response.Code.Unauthorized);
      expect(response.payload).toBe('Authorization is expired');
    });

    it('should return a response with an error message if the refresh token is already used', async () => {
      const refreshToken = authWorker.generateRefreshToken(1);
      const tmpRefreshToken = new RefreshToken(1, refreshToken, 2, 3, 4, 'A');
      const tmpAccessToken = new AccessToken(1, 'access_token', 2, 3);
      db.findRefreshToken.mockResolvedValue(tmpRefreshToken);
      db.findAccessTokenByRefreshTokenId.mockResolvedValue(tmpAccessToken);
      const response: typeof Response = await authWorker.getAccessToken(
        refreshToken
      );
      expect(response.httpCode).toBe(Response.Code.Unauthorized);
      expect(response.payload).toBe('Authorization is expired');
    });
  });

  describe('getRefreshToken', () => {
    it('should return a response with an access token and a new refresh token if the refresh token is valid', async () => {
      const refreshToken = authWorker.generateRefreshToken(1);
      const tmpRefreshToken = new RefreshToken(1, refreshToken, 2, 3, 4, 'A');
      db.findRefreshToken.mockResolvedValue(tmpRefreshToken);
      db.findRefreshTokenByParentId.mockResolvedValue(undefined);
      db.updateRefreshToken.mockResolvedValue(5);
      db.findAccessTokenByRefreshTokenId.mockResolvedValue(undefined);
      db.insertAccessToken.mockResolvedValue(undefined);
      const response: typeof Response = await authWorker.getRefreshToken(
        refreshToken
      );
      expect(response.httpCode).toBe(Response.Code.Ok);
      expect(response.payload.accessToken).toBeDefined();
      expect(response.payload.refreshToken).toBeDefined();
    });

    it('should return a response with an error message if the refresh token is not found', async () => {
      const refreshToken = 'invalid_token';
      db.findRefreshToken.mockResolvedValue(undefined);
      const response: typeof Response = await authWorker.getRefreshToken(
        refreshToken
      );
      expect(response.httpCode).toBe(Response.Code.Forbidden);
      expect(response.payload).toBe('RefreshToken is not found');
    });

    it('should return a response with an error message if the refresh token is expired', async () => {
      const refreshToken = 'expired_token';
      const tmpRefreshToken = new RefreshToken(1, refreshToken, 2, 3, 4, 'A');
      db.findRefreshToken.mockResolvedValue(tmpRefreshToken);
      authWorker.verifyRefreshToken = jest.fn().mockReturnValue(false);
      const response: typeof Response = await authWorker.getRefreshToken(
        refreshToken
      );
      expect(response.httpCode).toBe(Response.Code.Unauthorized);
      expect(response.payload).toBe('Authorization is expired');
    });

    it('should return a response with an error message if the refresh token is already used', async () => {
      const refreshToken = authWorker.generateRefreshToken(1);
      const tmpRefreshToken = new RefreshToken(1, refreshToken, 2, 3, 4, 'A');
      db.findRefreshToken.mockResolvedValue(tmpRefreshToken);
      db.findRefreshTokenByParentId.mockResolvedValue(tmpRefreshToken);
      const response: typeof Response = await authWorker.getRefreshToken(
        refreshToken
      );
      expect(response.httpCode).toBe(Response.Code.Unauthorized);
      expect(response.payload).toBe('Authorization is expired');
    });
  });

  describe('auth', () => {
    it('should return true if the access token is valid', async () => {
      const token = 'valid_token';
      db.findAccessToken.mockResolvedValue(new AccessToken(1, token, 2, 3));
      authWorker.verifyAccessToken = jest.fn().mockReturnValue(true);
      const result = await authWorker.auth(token);
      expect(result).toBe(true);
    });

    it('should return false if the access token is not found', async () => {
      const token = 'invalid_token';
      db.findAccessToken.mockResolvedValue(undefined);
      const result = await authWorker.auth(token);
      expect(result).toBe(false);
    });

    it('should return false if the access token is expired', async () => {
      const token = 'expired_token';
      db.findAccessToken.mockResolvedValue(new AccessToken(1, token, 2, 3));
      authWorker.verifyAccessToken = jest.fn().mockReturnValue(false);
      const result = await authWorker.auth(token);
      expect(result).toBe(false);
    });
  });

  describe('deleteAccessToken', () => {
    it('should delete the access token', async () => {
      const refreshToken = 'valid_token';
      const tmpRefreshToken = new RefreshToken(1, refreshToken, 2, 3, 4, 'A');
      const tmpAccessToken = new AccessToken(1, 'access_token', 2, 3);
      db.findRefreshToken.mockResolvedValue(tmpRefreshToken);
      db.findAccessTokenByRefreshTokenId.mockResolvedValue(tmpAccessToken);
      await authWorker.deleteAccessToken(refreshToken);
      expect(db.deleteAccessToken).toHaveBeenCalledWith(tmpAccessToken.id);
    });

    it('should return a response with an error message if the refresh token is not found', async () => {
      const refreshToken = 'invalid_token';
      db.findRefreshToken.mockResolvedValue(undefined);
      const response: typeof Response = await authWorker.deleteAccessToken(
        refreshToken
      );
      expect(response.httpCode).toBe(Response.Code.BadRequest);
      expect(response.payload).toBe('RefreshToken is not found');
    });

    it('should return a response with an error message if the access token is not found', async () => {
      const refreshToken = 'valid_token';
      const tmpRefreshToken = new RefreshToken(1, refreshToken, 2, 3, 4, 'A');
      db.findRefreshToken.mockResolvedValue(tmpRefreshToken);
      db.findAccessTokenByRefreshTokenId.mockResolvedValue(undefined);
      const response: typeof Response = await authWorker.deleteAccessToken(
        refreshToken
      );
      expect(response.httpCode).toBe(Response.Code.BadRequest);
      expect(response.payload).toBe('AccessToken is not found');
    });
  });

  describe('deleteRefreshToken', () => {
    it('should delete the refresh token and its children', async () => {
      const refreshToken = 'valid_token';
      const tmpRefreshToken = new RefreshToken(1, refreshToken, 2, 3, 4, 'A');
      db.findRefreshToken.mockResolvedValue(tmpRefreshToken);
      await authWorker.deleteRefreshToken(refreshToken);
      expect(db.deleteRefreshToken).toHaveBeenCalledWith(4);
    });

    it('should return a response with an error message if the refresh token is not found', async () => {
      const refreshToken = 'invalid_token';
      db.findRefreshToken.mockResolvedValue(undefined);
      const response: typeof Response = await authWorker.deleteRefreshToken(
        refreshToken
      );
      expect(response.httpCode).toBe(Response.Code.BadRequest);
      expect(response.payload).toBe('RefreshToken is not found');
    });
  });
});
