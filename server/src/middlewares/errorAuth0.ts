import { NextFunction, Request, Response } from 'express';
import {
  InvalidTokenError,
  UnauthorizedError,
} from 'express-oauth2-jwt-bearer';

import { Response as ServerResponse } from '@src/entities/response';

const errorAuth0Handler = (
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (error instanceof InvalidTokenError) {
    const message = new ServerResponse(ServerResponse.Code.Unauthorized, {
      message: 'Bad credentials',
    });

    return response.status(message.httpCode).json({ ...message.payload });
  }

  if (error instanceof UnauthorizedError) {
    const message = new ServerResponse(ServerResponse.Code.Unauthorized, {
      message: 'Requires authentication',
    });

    return response.status(message.httpCode).json({ ...message.payload });
  }

  const message = new ServerResponse(ServerResponse.Code.InternalServerError, {
    message: 'Internal Server Error',
  });

  response.status(message.httpCode).json({ ...message.payload });
  next(error);
};

export default errorAuth0Handler;
