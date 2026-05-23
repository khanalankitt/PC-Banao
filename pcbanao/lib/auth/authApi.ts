const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

export interface BackendUser {
  _id?: string;
  name: string;
  email: string;
  image?: string;
  role: 'user' | 'admin';
}

export interface OAuthTokenResponse {
  token: string;
  user: BackendUser;
}

export async function exchangeOAuthToken(
  provider: 'google' | 'facebook',
  accessToken: string,
): Promise<OAuthTokenResponse> {
  const res = await fetch(`${BACKEND_URL}/api/auth/oauth`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ provider, accessToken }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(error.message ?? 'Failed to authenticate with backend');
  }

  const body = await res.json() as { data: OAuthTokenResponse };
  return body.data;
}
