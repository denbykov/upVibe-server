import Express from 'express';
import pg from 'pg';

import { AuthWorker } from '@src/business/authWorker';
import { AuthorizationRepository } from '@src/data';
import { Config } from '@src/entities/config';
import { Response } from '@src/entities/response';

const auth0Middleware = (config: Config, databasePool: pg.Pool) => {
  return async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    const authWorker = new AuthWorker(
      await new AuthorizationRepository(databasePool),
      config
    );
    const response = new Response(
      Response.Code.Unauthorized,
      'Unauthorized',
      1
    );
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(response.httpCode).send(response.serialize());
    }
    const token = authHeader.split(' ')[1];
    const auth = await authWorker.auth(token);
    if (!auth) {
      return res.status(response.httpCode).send(response.serialize());
    }
    next();
  };
};

export default auth0Middleware;
