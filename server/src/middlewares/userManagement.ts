import { NextFunction, Request, Response } from 'express';

import { UserWorker } from '@src/business/userWorker';
import { Response as ServerResponse } from '@src/entities/response';

const userManagementMiddleware = (
  permissions: Array<string>,
  worker: UserWorker
) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const rawToken = request.headers.authorization?.split(' ')[1].split('.')[1];
    const token = JSON.parse(
      Buffer.from(rawToken!, 'base64').toString('ascii')
    );
    const dbUser = await worker.handleAuthorization(token, permissions);
    if (!dbUser) {
      const message = new ServerResponse(
        ServerResponse.Code.Forbidden,
        'Authorization error',
        1
      );
      return response.status(message.httpCode).send(message.serialize());
    }

    request.body.user = dbUser;
    next();
  };
};

export default userManagementMiddleware;
