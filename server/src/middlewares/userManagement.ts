import { NextFunction, Request, Response } from 'express';

import { UserWorker } from '@src/business/userWorker';
import { Response as serverResponse } from '@src/entities/response';

const userManagementMiddleware = (
  permissions: Array<string>,
  worker: UserWorker
) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const rawToken = request.headers.authorization?.split(' ')[1].split('.')[1];
    const token = JSON.parse(
      Buffer.from(rawToken!, 'base64').toString('ascii')
    );
    const dbUser = await worker.manageUser(token, permissions);
    if (!dbUser) {
      const message = new serverResponse(
        serverResponse.Code.InternalServerError,
        'Error managing user',
        1
      );
      response.status(message.code).send(message.serialize());
      return;
    }
    request.body.user = dbUser;
    next();
  };
};

export default userManagementMiddleware;
