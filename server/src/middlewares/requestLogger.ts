import { NextFunction, Request, Response } from 'express';

import { serverLogger } from '@src/utils/server/logger';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  serverLogger.info(
    `[${req.method}] ${req.path}, ${req.socket.remoteAddress}:${req.socket.remotePort}`
  );
  next();
};
