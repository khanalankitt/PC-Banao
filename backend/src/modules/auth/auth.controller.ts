import { Response } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { sendSuccess } from '../../shared/utils/apiResponse';
import { AuthRequest } from '../../shared/types';
import { OAuthLoginInput } from './auth.validator';
import { loginWithOAuth, getMe } from './auth.service';

export const oauthLogin = asyncHandler(async (req, res: Response) => {
  const body = req.body as OAuthLoginInput;
  const result = await loginWithOAuth({ provider: body.provider, accessToken: body.accessToken });
  sendSuccess(res, result, 'Login successful', 200);
});

export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await getMe(req.user!.userId);
  sendSuccess(res, user, 'User fetched');
});
