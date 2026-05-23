import { Request, Response, NextFunction } from 'express';
import { env } from '../../config/env';
import { AppError } from '../types';
import { sendError } from '../utils/apiResponse';

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  // Operational errors we created intentionally
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // Mongoose validation error
  if (isMongooseValidationError(err)) {
    const messages = Object.values(err.errors).map((e: { message: string }) => e.message);
    sendError(res, 'Validation failed', 422, messages);
    return;
  }

  // Mongoose duplicate key
  if (isMongooseDuplicateKeyError(err)) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? 'field';
    sendError(res, `Duplicate value for ${field}`, 409);
    return;
  }

  // Mongoose cast error (invalid ObjectId etc.)
  if (isMongooseCastError(err)) {
    sendError(res, `Invalid value for ${err.path}`, 400);
    return;
  }

  // JWT errors
  if (err instanceof Error && err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid token', 401);
    return;
  }
  if (err instanceof Error && err.name === 'TokenExpiredError') {
    sendError(res, 'Token expired', 401);
    return;
  }

  // Unknown — don't leak internals in production
  if (env.nodeEnv !== 'production') {
    console.error('[Unhandled error]', err);
  }

  const message =
    env.nodeEnv === 'production'
      ? 'Internal server error'
      : err instanceof Error
        ? err.message
        : String(err);

  sendError(res, message, 500);
}

// ─── type guards ─────────────────────────────────────────────────────────────

interface MongooseValidationError {
  name: 'ValidationError';
  errors: Record<string, { message: string }>;
}

interface MongooseDuplicateKeyError {
  code: 11000;
  keyValue?: Record<string, unknown>;
}

interface MongooseCastError {
  name: 'CastError';
  path: string;
}

function isMongooseValidationError(e: unknown): e is MongooseValidationError {
  return typeof e === 'object' && e !== null && (e as { name?: string }).name === 'ValidationError';
}

function isMongooseDuplicateKeyError(e: unknown): e is MongooseDuplicateKeyError {
  return typeof e === 'object' && e !== null && (e as { code?: number }).code === 11000;
}

function isMongooseCastError(e: unknown): e is MongooseCastError {
  return typeof e === 'object' && e !== null && (e as { name?: string }).name === 'CastError';
}
