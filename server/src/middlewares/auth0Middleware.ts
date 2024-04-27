import { NextFunction, Request, Response } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';

import { Config } from '@src/entities/config';

const auth0Middleware = (config: Config) => {
  if (config.appDebug) {
    return (req: Request, res: Response, next: NextFunction) => next();
  }
  return auth({
    issuerBaseURL: `https://${config.auth0Domain}`,
    audience: config.auth0Audience,
  });
};

export default auth0Middleware;
