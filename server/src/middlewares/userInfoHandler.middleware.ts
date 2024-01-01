import { NextFunction, Request, Response } from 'express';

import { Config } from '@src/entities/config';
import { Response as responseServer } from '@src/entities/response';
import { User } from '@src/entities/user';
import { parseReadableStreamToJSON } from '@src/utils/server/parseReadableStreamToJSON';

const userInfoHandler = (config: Config, permissions: Array<string>) => {
  const domain = config.autho0Domain;
  return async (request: Request, response: Response, next: NextFunction) => {
    const headers = new Headers();
    headers.append('Authorization', request.headers.authorization || '');
    const req = await fetch(`https://${domain}/userinfo`, {
      headers: headers,
    });

    const reqData =
      req.status == 200 ? await parseReadableStreamToJSON(req.body!) : {};
    const pureToken = request.headers.authorization
      ?.split(' ')[1]
      .split('.')[1];
    const convertedToken = JSON.parse(
      Buffer.from(pureToken!, 'base64').toString('ascii')
    );
    for (const permission of permissions) {
      if (!convertedToken.permissions.includes(permission)) {
        const message = new responseServer(
          responseServer.Code.Forbidden,
          'You do not have permission to access this resource.',
          1
        );
        return response.status(message.httpCode).send(message.serialize());
      }
    }
    request.body.user = new User(reqData?.sub, reqData?.username);
    next();
  };
};

export default userInfoHandler;
