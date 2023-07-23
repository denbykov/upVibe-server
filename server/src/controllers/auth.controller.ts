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
    const refreshToken = req.body.refreshToken;
    const tokens = await authWorker.getAccessToken(refreshToken);
    if (!tokens) {
      return res.status(401).send({
        message: 'Refresh token failed',
      });
    }
    return res.status(200).send({
      tokens,
    });
  };
}

export { AuthController };
