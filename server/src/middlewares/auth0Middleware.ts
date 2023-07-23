import { AuthWorker } from '@src/business/authWorker';
import { Database } from '@src/data';
import { Config } from '@src/entities/config';
import Express from 'express';
import pg from 'pg';

const auth0Middleware = (config: Config, databasePool: pg.Pool) => {
  return async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    const authWorker = new AuthWorker(await new Database(databasePool), config);
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(403).send({
        message: 'Token is invalid',
        _error: 1,
      });
    }
    const token = authHeader.split(' ')[1];
    const auth = await authWorker.auth(token);
    if (!auth) {
      return res.status(403).send({
        message: 'Token is invalid',
        _error: 1,
      });
    }
    next();
  };
};

export default auth0Middleware;
