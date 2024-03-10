import Express from 'express';

export default (
  error: Error,
  request: Express.Request,
  response: Express.Response,
  next: Express.NextFunction
) => {
  if (error instanceof SyntaxError && 'body' in error) {
    //FixMe replace code with constant
    return response
      .status(400)
      .json({ message: 'Bad JSON in request body', code: -1 });
  }
  next(error);
};
