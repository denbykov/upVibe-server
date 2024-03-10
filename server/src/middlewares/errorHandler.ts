import { NextFunction, Request, Response } from 'express';

import { serverLogger } from '@src/utils/server/logger';

const errorHandler = async (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  response.status(500).send('Internal server error');
};

export default errorHandler;
