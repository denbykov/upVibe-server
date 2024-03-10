import Express from 'express';
import pg from 'pg';

import { Config } from '@src/entities/config';
import { Response } from '@src/entities/response';
import { SQLManager } from '@src/sqlManager';

import { BaseController } from './base';

class APIController extends BaseController {
  constructor(config: Config, databasePool: pg.Pool, sqlManager: SQLManager) {
    super(config, databasePool, sqlManager);
  }

  public healthCheck = async (
    request: Express.Request,
    response: Express.Response
  ) => {
    return response.status(Response.Code.Ok).json({
      message: 'API is healthy!',
    });
  };

  public getInfo = async (
    request: Express.Request,
    response: Express.Response
  ) => {
    return response.status(Response.Code.Ok).json({
      // FixMe: apiVersion should not be a part of the config, it should be established and taken from the build system
      message: `${this.config.apiVersion}`,
    });
  };

  public authTest = async (
    request: Express.Request,
    response: Express.Response
  ) => {
    return response.status(Response.Code.Ok).json({
      message: 'Auth test passed!',
    });
  };
}

export { APIController };
