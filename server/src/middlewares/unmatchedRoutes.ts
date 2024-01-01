import Express from 'express';

import { Response } from '@src/entities/response';

export default async (req: Express.Request, res: Express.Response) => {
  const response: Response = new Response(
    Response.Code.NotFound,
    'Not Found',
    1
  );
  return res.status(response.httpCode).send(response.serialize());
};
