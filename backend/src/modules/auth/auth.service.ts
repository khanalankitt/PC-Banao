import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { AppError } from '../../shared/types';
import { AuthPayload } from '../../shared/types';
import { upsertOAuthUser, findUserById, UserRow } from './auth.repository';
import { AuthProvider } from '../../models/user.model';
import { verifyGoogleToken, verifyFacebookToken } from './auth.provider';

export interface OAuthLoginInput {
  provider: AuthProvider;
  accessToken: string;
}

export interface AuthTokenResponse {
  token: string;
  user: Pick<UserRow, 'name' | 'email' | 'image' | 'role'>;
}

function signJwt(payload: AuthPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

export async function loginWithOAuth(input: OAuthLoginInput): Promise<AuthTokenResponse> {
  const providerProfile =
    input.provider === 'google'
      ? await verifyGoogleToken(input.accessToken)
      : await verifyFacebookToken(input.accessToken);

  const user = await upsertOAuthUser({
    provider:   input.provider,
    providerId: providerProfile.id,
    name:       providerProfile.name,
    email:      providerProfile.email,
    image:      providerProfile.image,
  });

  const token = signJwt({
    userId: String(user._id),
    role:   user.role,
  });

  return {
    token,
    user: { name: user.name, email: user.email, image: user.image, role: user.role },
  };
}

export async function getMe(userId: string): Promise<UserRow> {
  const user = await findUserById(userId);
  if (!user) throw new AppError('User not found', 404);
  return user;
}
