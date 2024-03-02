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

  public healthCheck = async (req: Express.Request, res: Express.Response) => {
    const response: Response = new Response(Response.Code.Ok, {
      message: 'API is healthy!',
    });
    return res
      .status(response.httpCode)
      .json({ ...response.payload, code: response.code });
  };

  public getInfo = async (req: Express.Request, res: Express.Response) => {
    const response: Response = new Response(Response.Code.Ok, {
      message: `Welcome to ${this.config.apiURI} API! Version: ${this.config.apiVersion} 🚀`,
    });
    return res
      .status(response.httpCode)
      .json({ ...response.payload, code: response.code });
  };

  public authTest = async (req: Express.Request, res: Express.Response) => {
    const response: Response = new Response(Response.Code.Ok, {
      message: 'Auth test passed!',
    });
    return res
      .status(response.httpCode)
      .json({ ...response.payload, code: response.code });
  };
}

export { APIController };
