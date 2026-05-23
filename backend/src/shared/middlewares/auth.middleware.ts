import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { AppError, AuthRequest, AuthPayload } from '../types';
import { asyncHandler } from '../utils/asyncHandler';

export const authenticate = asyncHandler(async (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) throw new AppError('Authentication required', 401);

  const payload = jwt.verify(token, env.jwtSecret) as AuthPayload;
  req.user = payload;
  next();
});

// Attaches user to req if a valid token is present, but does not fail if absent.
export const optionalAuthenticate = asyncHandler(async (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (token) {
    try {
      const payload = jwt.verify(token, env.jwtSecret) as AuthPayload;
      req.user = payload;
    } catch {
      // Invalid token — treat as unauthenticated
    }
  }

  next();
});

export const authorize =
  (...roles: Array<'user' | 'admin'>) =>
  (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) throw new AppError('Authentication required', 401);
    if (!roles.includes(req.user.role)) throw new AppError('Forbidden', 403);
    next();
  };
