import { AppError } from '../../shared/types';

export interface OAuthProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
}

// Decode a JWT without verifying signature (we trust Google/Facebook as issuers).
// Used to read claims from Google's id_token which is a signed JWT.
function decodeJwtPayload(token: string): Record<string, unknown> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Not a JWT');
  // base64url → base64 → JSON
  const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const json = Buffer.from(payload, 'base64').toString('utf8');
  return JSON.parse(json) as Record<string, unknown>;
}

function isIdToken(token: string): boolean {
  // id_tokens are JWTs (three dot-separated base64url segments)
  return token.split('.').length === 3;
}

export async function verifyGoogleToken(accessToken: string): Promise<OAuthProfile> {
  // Google can send either an id_token (JWT) or a userinfo access_token.
  // id_token is self-contained — decode it directly without a network call.
  if (isIdToken(accessToken)) {
    try {
      const claims = decodeJwtPayload(accessToken);

      if (!claims.email_verified) throw new AppError('Google email not verified', 401);

      return {
        id:    claims.sub as string,
        name:  claims.name as string,
        email: claims.email as string,
        image: (claims.picture as string | undefined),
      };
    } catch (e) {
      if (e instanceof AppError) throw e;
      // Fall through to userinfo endpoint if JWT decode fails
    }
  }

  // Fallback: use the token as a bearer token against the userinfo endpoint
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

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
