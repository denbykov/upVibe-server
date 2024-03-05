import { NextFunction, Request, Response } from 'express';

import { UserWorker } from '@src/business/user';
import { Response as ServerResponse } from '@src/entities/response';

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
      rawToken!,
      tokenPayload,
      permissions
    );
    if (!dbUser) {
      const message = new ServerResponse(
        ServerResponse.Code.Forbidden,
        { message: 'Authorization error' },
        1
      );
      return response
        .status(message.httpCode)
        .json({ ...message.payload, code: message.code });
    }

    request.body.user = dbUser;
    next();
  };
};

export default userManagementMiddleware;
