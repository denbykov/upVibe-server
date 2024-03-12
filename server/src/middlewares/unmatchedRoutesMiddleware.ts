import Express from 'express';

const unmatchedRoutesMiddleware = async (
  req: Express.Request,
  res: Express.Response
) => {
  return res.status(404).json({
    message: 'Not Found',
  });
};

export default unmatchedRoutesMiddleware;
