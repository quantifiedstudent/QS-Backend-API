import { NextFunction, Request, Response } from 'express';
import HttpException from '../helpers/exceptions/httpException';

function errorMiddleware(
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const status = error.status || 500;
  const message = error.message || 'Oops! Something went wrong.';
  response.status(status).send({
    message,
    status,
  });
  if (!error) next();
}

export default errorMiddleware;
