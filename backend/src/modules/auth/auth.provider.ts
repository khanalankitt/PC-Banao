import { AppError } from '../../shared/types';

export interface OAuthProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export async function verifyGoogleToken(accessToken: string): Promise<OAuthProfile> {
  const res = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  if (!res.ok) throw new AppError('Invalid Google access token', 401);

  const data = await res.json() as {
    sub: string;
    name: string;
    email: string;
    picture?: string;
    email_verified?: boolean;
  };

  if (!data.email_verified) throw new AppError('Google email not verified', 401);

  return {
    id:    data.sub,
    name:  data.name,
    email: data.email,
    image: data.picture,
  };
}

export async function verifyFacebookToken(accessToken: string): Promise<OAuthProfile> {
  const res = await fetch(
    `https://graph.facebook.com/me?fields=id,name,email,picture.width(200)&access_token=${accessToken}`,
  );

  if (!res.ok) throw new AppError('Invalid Facebook access token', 401);

  const data = await res.json() as {
    id: string;
    name: string;
    email?: string;
    picture?: { data?: { url?: string } };
  };

  if (!data.email) throw new AppError('Facebook account has no public email', 422);

  return {
    id:    data.id,
    name:  data.name,
    email: data.email,
    image: data.picture?.data?.url,
  };
}
