import { Request } from 'express';

export interface AuthPayload {
  userId: string;
  role: 'user' | 'admin';
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly isOperational = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
