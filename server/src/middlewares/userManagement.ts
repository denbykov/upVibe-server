import { NextFunction, Request, Response } from 'express';
import pg from 'pg';

import { UserWorker } from '@src/business/userWorker';
import { UserRepository } from '@src/data/userRepository';
import { Config } from '@src/entities/config';
import { Response as responseServer } from '@src/entities/response';
import { User } from '@src/entities/user';
import { readJSON } from '@src/utils/server/readJSON';

const userManagementMiddleware = (
  config: Config,
  databasePool: pg.Pool,
  permissions: Array<string>
) => {
  const domain = config.autho0Domain;
  return async (request: Request, response: Response, next: NextFunction) => {
    const rawToken = request.headers.authorization?.split(' ')[1].split('.')[1];
    const token = JSON.parse(
      Buffer.from(rawToken!, 'base64').toString('ascii')
    );
    for (const permission of permissions) {
      if (!token.permissions.includes(permission)) {
        const message = new responseServer(
          responseServer.Code.Forbidden,
          'You do not have permission to access this resource.',
          1
        );
        return response.status(message.httpCode).send(message.serialize());
      }
    }

    const userWorker = new UserWorker(
      await new UserRepository(databasePool),
      config
    );

    let dbUser = await userWorker.getUser(token.sub);

    if (dbUser instanceof responseServer) {
      const headers = new Headers();
      headers.append('Authorization', request.headers.authorization || '');
      const req = await fetch(`https://${domain}/userinfo`, {
        headers: headers,
      });
      const reqData = req.status == 200 ? await readJSON(req.body!) : {};
      if (req.status != 200) {
        const msg = new responseServer(
          responseServer.Code.InternalServerError,
          'Error getting user info.',
          1
        );
        return response.status(msg.httpCode).send(msg.serialize());
      }
      dbUser = await userWorker.setUser(
        new User(0, token.sub, reqData?.username)
      );
    }
    request.body.user = dbUser;
    next();
  };
};

export default userManagementMiddleware;
