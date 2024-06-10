import { NextFunction, Request, Response } from 'express';

import { UserWorker } from '@src/business/userWorker';
import { Config } from '@src/entities/config';
import { serverLogger } from '@src/utils/server/logger';

const userManagementMiddleware = (
  permissions: Array<string>,
  worker: UserWorker,
  config: Config
) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      if (config.appDebug) {
        const debugToken = {
          sub: 'debug',
          permissions: permissions,
        };
        const dbUser = await worker.handleAuthorization(
          debugToken,
          permissions
        );
        request.body.user = dbUser;
        next();
        return;
      }
      const rawToken = request.headers.authorization!.split(' ')[1];
      const encodedTokenPayload = rawToken.split('.')[1];
      const tokenPayload: JSON.JSONObject = JSON.parse(
        Buffer.from(encodedTokenPayload!, 'base64').toString('ascii')
      );
      serverLogger.debug(`Sub: ${tokenPayload.sub}`);
      serverLogger.debug(`Expire: ${tokenPayload.exp}`);
      const expireDate = new Date(tokenPayload.exp * 1000).toISOString();
      serverLogger.debug(`Expire: ${expireDate}`);

      const dbUser = await worker.handleAuthorization(
        tokenPayload,
        permissions
      );
      request.body.rawToken = rawToken;
      request.body.user = dbUser;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default userManagementMiddleware;
