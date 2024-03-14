import { NextFunction, Request, Response } from 'express';
import {
  InvalidTokenError,
  UnauthorizedError,
} from 'express-oauth2-jwt-bearer';

const auth0ErrorHandlingMiddleware = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (error instanceof InvalidTokenError) {
    return response.status(401).json({
      message: 'Bad credentials',
    });
  }

  if (error instanceof UnauthorizedError) {
    return response.status(401).json({
      message: 'Requires authentication',
    });
  }

  next(error);
};

export default auth0ErrorHandlingMiddleware;
