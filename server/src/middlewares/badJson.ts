import Express from 'express';

import { Response } from '@src/entities/response';

export default (
  err: Express.ErrorRequestHandler,
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  if (err instanceof SyntaxError && 'body' in err) {
    const response: Response = new Response(
      Response.Code.BadRequest,
      { message: 'Bad JSON in request body' },
      -1
    );
    return res
      .status(response.httpCode)
      .json({ ...response.payload, code: response.code });
  }
  next();
};
