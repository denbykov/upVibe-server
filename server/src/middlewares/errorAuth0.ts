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
    const message = new ServerResponse(
      ServerResponse.Code.Unauthorized,
      { message: 'Bad credentials' },
      1
    );

    return response
      .status(message.httpCode)
      .json({ ...message.payload, code: message.code });
  }

  if (error instanceof UnauthorizedError) {
    const message = new ServerResponse(
      ServerResponse.Code.Unauthorized,
      { message: 'Requires authentication' },
      1
    );

    return response
      .status(message.httpCode)
      .json({ ...message.payload, code: message.code });
  }

  const message = new ServerResponse(
    ServerResponse.Code.InternalServerError,
    { message: 'Internal Server Error' },
    1
  );

  response
    .status(message.httpCode)
    .json({ ...message.payload, code: message.code });
  next(error);
};

export default errorAuth0Handler;
