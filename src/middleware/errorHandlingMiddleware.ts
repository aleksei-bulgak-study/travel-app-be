import { NextFunction, Request, Response } from 'express';
import ServerError from '../model/serverError';

const errorHandler = (
  error: Error,
  _: Request,
  response: Response,
  next: NextFunction
): void => {
  if (error instanceof ServerError) {
    response.status(error.getStatus()).json({ message: error.message });
    return;
  } 
  next(error);
};

export default errorHandler;