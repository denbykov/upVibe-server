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
    return res.status(response.httpCode).json({ ...response.payload });
  };

  public getInfo = async (req: Express.Request, res: Express.Response) => {
    const response: Response = new Response(Response.Code.Ok, {
      message: `${this.config.apiVersion}`,
    });
    return res.status(response.httpCode).json({ ...response.payload });
  };

  public authTest = async (req: Express.Request, res: Express.Response) => {
    const response: Response = new Response(Response.Code.Ok, {
      message: 'Auth test passed!',
    });
    return res.status(response.httpCode).json({ ...response.payload });
  };
}

export { APIController };
