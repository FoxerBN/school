import { Request, Response, NextFunction } from 'express';
import { ApiError } from './api.error';

export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;

  const shortStack = err.stack ? err.stack.split('\n')[0] : '';

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : shortStack,
  });
}
