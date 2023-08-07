import Express from 'express';
import pg from 'pg';

import { AuthWorker } from '@src/business/authWorker';
import { AuthorizationRepository } from '@src/data';
import { Config } from '@src/entities/config';
import { Response } from '@src/entities/response';
import { LoginRequest } from '@src/entities/user';

import { BaseController } from './base.controller';

class AuthController extends BaseController {
  constructor(config: Config, databasePool: pg.Pool) {
    super(config, databasePool);
  }

  public login = async (req: Express.Request, res: Express.Response) => {
    const authWorker = new AuthWorker(
      await new AuthorizationRepository(this.databasePool),
      this.config
    );
    const tokens = await authWorker.login(
      new LoginRequest(req.body.name, req.body.password)
    );

    return res.status(tokens.httpCode).send(tokens.serialize());
  };

  public getAccessToken = async (
    req: Express.Request,
    res: Express.Response
  ) => {
    const authWorker = new AuthWorker(
      await new AuthorizationRepository(this.databasePool),
      this.config
    );
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(Response.Code.Forbidden).send({ message: 'Forbidden' });
    }
    const refreshToken = authHeader.split(' ')[1];
    const tokens = await authWorker.getAccessToken(refreshToken);
    return res.status(tokens.httpCode).send(tokens.serialize());
  };

  public getRefreshToken = async (
    req: Express.Request,
    res: Express.Response
  ) => {
    const authWorker = new AuthWorker(
      await new AuthorizationRepository(this.databasePool),
      this.config
    );
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(Response.Code.Forbidden).send({ message: 'Forbidden' });
    }
    const refreshToken = authHeader.split(' ')[1];
    const tokens = await authWorker.getRefreshToken(refreshToken);
    return res.status(tokens.httpCode).send(tokens.serialize());
  };

  public deleteAccessToken = async (
    req: Express.Request,
    res: Express.Response
  ) => {
    const authWorker = new AuthWorker(
      await new AuthorizationRepository(this.databasePool),
      this.config
    );
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(Response.Code.Forbidden).send({ message: 'Forbidden' });
    }
    const refreshToken = authHeader.split(' ')[1];
    const response = await authWorker.deleteAccessToken(refreshToken);
    return res.status(response.httpCode).send(response.serialize());
  };

  public deleteRefreshToken = async (
    req: Express.Request,
    res: Express.Response
  ) => {
    const authWorker = new AuthWorker(
      await new AuthorizationRepository(this.databasePool),
      this.config
    );
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(Response.Code.Forbidden).send({ message: 'Forbidden' });
    }
    const refreshToken = authHeader.split(' ')[1];
    const response = await authWorker.deleteRefreshToken(refreshToken);
    return res.status(response.httpCode).send(response.serialize());
  };
}

export { AuthController };
