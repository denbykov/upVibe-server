import Express from 'express';
import pg from 'pg';

import { Config } from '@src/entities/config';
import { SQLManager } from '@src/sqlManager';
import { APP_VERSION } from '@src/version';

import { BaseController } from './baseController';

class APIController extends BaseController {
  constructor(config: Config, databasePool: pg.Pool, sqlManager: SQLManager) {
    super(config, databasePool, sqlManager);
  }

  public healthCheck = async (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction
  ) => {
    try {
      return response.status(200).json({
        message: 'API is healthy!',
      });
    } catch (error) {
      next(error);
    }
  };

  public getInfo = async (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction
  ) => {
    try {
      return response.status(200).json({
        version: `${APP_VERSION}`,
      });
    } catch (error) {
      next(error);
    }
  };

  public authTest = async (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction
  ) => {
    try {
      return response.status(200).json({
        message: 'Auth test passed!',
      });
    } catch (error) {
      next(error);
    }
  };
}

export { APIController };
