import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { Database } from '@src/data';
import { LoginRequest } from '@src/entities/user';
import { AuthWorker } from '@src/business/authWorker';
import { Config } from '@src/entities/config';
import pg from 'pg';

class AuthController extends BaseController {
  constructor(config: Config, databasePool: pg.Pool) {
    super(config, databasePool);
  }

  public login = async (req: Request, res: Response) => {
    const authWorker = new AuthWorker(
      await new Database(this.databasePool),
      this.config
    );
    const tokens = await authWorker.login(
      new LoginRequest(req.body.name, req.body.password)
    );

    if (!tokens) {
      return res.status(401).send({
        message: 'Login failed',
      });
    }

    return res.status(200).send({
      tokens,
    });
  };

  public getAccessToken = async (req: Request, res: Response) => {
    const authWorker = new AuthWorker(
      await new Database(this.databasePool),
      this.config
    );
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(403).send({
        message: 'Token is invalid',
        error: 1,
      });
    }
    const refreshToken = authHeader.split(' ')[1];
    const tokens = await authWorker.getAccessToken(refreshToken);
    if (!tokens) {
      return res.status(401).send({
        message: 'Refresh token is invalid',
        error: 1,
      });
    }
    return res.status(200).send({
      tokens,
    });
  };
}

export { AuthController };
