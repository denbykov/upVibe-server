import Express from 'express';
import pg from 'pg';

import { APIWorker } from '@src/business/apiWorker';
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

  private buildAPIWorker = (): APIWorker => {
    return new APIWorker(
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
    const { user } = request.body;
    if (user) {
      return response.status(400).json({
        message: 'User already exists',
        code: -1,
      });
    }
    const apiWorker = this.buildAPIWorker();
    const reg = await apiWorker.registerUser(
      request.body.rawToken,
      request.body.deviceName
    );
    reg
      ? response.status(200).json({ message: 'User registered!' })
      : response.status(500).json({ message: 'User registration failed!' });
  };
}

export { APIController };
