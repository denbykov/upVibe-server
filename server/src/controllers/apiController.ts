import Express from 'express';
import pg from 'pg';

import { UserWorker } from '@src/business/userWorker';
import { UserInfoAgent } from '@src/data/userInfoAgentRepository';
import { UserRepository } from '@src/data/userRepository';
import { Config } from '@src/entities/config';
import { SQLManager } from '@src/sqlManager';
import { APP_VERSION } from '@src/version';

import { BaseController } from './baseController';

class APIController extends BaseController {
  constructor(config: Config, databasePool: pg.Pool, sqlManager: SQLManager) {
    super(config, databasePool, sqlManager);
  }

  private buildUserWorker = (): UserWorker => {
    return new UserWorker(
      new UserRepository(this.databasePool),
      new UserInfoAgent(this.config)
    );
  };

  public healthCheck = async (
    request: Express.Request,
    response: Express.Response
  ) => {
    return response.status(200).json({
      message: 'API is healthy!',
    });
  };

  public getInfo = async (
    request: Express.Request,
    response: Express.Response
  ) => {
    return response.status(200).json({
      version: `${APP_VERSION}`,
    });
  };

  public authTest = async (
    request: Express.Request,
    response: Express.Response
  ) => {
    return response.status(200).json({
      message: 'Auth test passed!',
    });
  };

  public register = async (
    request: Express.Request,
    response: Express.Response
  ) => {
    const rawToken = request.headers.authorization!.split(' ')[1];
    const encodedTokenPayload = rawToken.split('.')[1];
    const tokenPayload: JSON.JSONObject = JSON.parse(
      Buffer.from(encodedTokenPayload!, 'base64').toString('ascii')
    );
    const userWorker = this.buildUserWorker();
    const reg = await userWorker.handleRegistration(
      rawToken,
      tokenPayload,
      request.body.deviceName
    );
    return response.status(200).json(reg);
  };
}

export { APIController };
