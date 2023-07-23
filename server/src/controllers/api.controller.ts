import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { Config } from '@src/entities/config';
import pg from 'pg';

class APIController extends BaseController {
  constructor(config: Config, databasePool: pg.Pool) {
    super(config, databasePool);
  }

  public getInfo = async (req: Request, res: Response) => {
    return res.send({
      message: `Welcome to ${this.config.apiURI} API! Version: ${this.config.apiVersion} 🚀 `,
      _error: 0,
    });
  };

  public authTest = async (req: Request, res: Response) => {
    return res.send({
      message: 'Auth test passed!',
      _error: 0,
    });
  };
}

export { APIController };
