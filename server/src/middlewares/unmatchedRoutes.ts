import Express from 'express';

import { Response } from '@src/entities/response';

export default async (req: Express.Request, res: Express.Response) => {
  const response: Response = new Response(Response.Code.NotFound, {
    message: 'Not Found',
  });

  return res.status(response.httpCode).json({ ...response.payload });
};
