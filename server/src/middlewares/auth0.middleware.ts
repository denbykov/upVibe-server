import { auth } from 'express-oauth2-jwt-bearer';

import { Config } from '@src/entities/config';

const auth0Middleware = (config: Config) => {
  return auth({
    issuerBaseURL: `https://${config.autho0Domain}`,
    audience: config.auth0Audience,
  });
};

export default auth0Middleware;
