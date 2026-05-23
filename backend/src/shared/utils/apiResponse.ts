import { Response } from 'express';

export interface ApiResponseBody<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
): void {
  const body: ApiResponseBody<T> = { success: true, message, data };
  res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  errors?: unknown,
): void {
  const body: ApiResponseBody = { success: false, message, ...(errors ? { errors } : {}) };
  res.status(statusCode).json(body);
}
