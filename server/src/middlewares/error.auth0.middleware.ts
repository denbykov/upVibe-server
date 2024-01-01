import { NextFunction, Request, Response } from 'express';
import {
  InvalidTokenError,
  UnauthorizedError,
} from 'express-oauth2-jwt-bearer';

import { Response as responseServer } from '@src/entities/response';

const errorAuth0Handler = (
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (error instanceof InvalidTokenError) {
    const message = new responseServer(
      responseServer.Code.Unauthorized,
      'Bad credentials',
      1
    );

    return response.status(message.httpCode).send(message.serialize());
  }

  if (error instanceof UnauthorizedError) {
    const message = new responseServer(
      responseServer.Code.Unauthorized,
      'Requires authentication',
      1
    );

    return response.status(message.httpCode).send(message.serialize());
  }

  const message = new responseServer(
    responseServer.Code.InternalServerError,
    'Internal Server Error',
    1
  );

  response.status(message.httpCode).send(message.serialize());
  next(error);
};

export default errorAuth0Handler;
