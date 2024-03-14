import { NextFunction, Request, Response } from 'express';

import { UserWorker } from '@src/business/userWorker';

const userManagementMiddleware = (
  permissions: Array<string>,
  worker: UserWorker
) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const rawToken = request.headers.authorization!.split(' ')[1];
    const encodedTokenPayload = rawToken.split('.')[1];
    const tokenPayload: JSON.JSONObject = JSON.parse(
      Buffer.from(encodedTokenPayload!, 'base64').toString('ascii')
    );
    const dbUser = await worker.handleAuthorization(
      rawToken,
      tokenPayload,
      permissions
    );
    if (!dbUser) {
      return response.status(403).json({
        message: 'Authorization error',
      });
    }

    request.body.user = dbUser;
    next();
  };
};

export default userManagementMiddleware;
