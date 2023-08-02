import Express from 'express';
import { BaseController } from './base.controller';
import { Config } from '@src/entities/config';
import { Response } from '@src/entities/response';
import pg from 'pg';

class APIController extends BaseController {
  constructor(config: Config, databasePool: pg.Pool) {
    super(config, databasePool);
  }

  public getInfo = async (req: Express.Request, res: Express.Response) => {
    const response: Response = new Response(Response.Code.Ok, {
      message: `Welcome to ${this.config.apiURI} API! Version: ${this.config.apiVersion} 🚀`,
    });
    return res.status(response.httpCode).send(response.serialize());
  };

  public authTest = async (req: Express.Request, res: Express.Response) => {
    const response: Response = new Response(
      Response.Code.Ok,
      'Auth test passed!'
    );
    return res.status(response.httpCode).send(response.serialize());
  };
}

export { APIController };
