import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { exchangeOAuthToken } from '@/lib/auth/authApi';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: { access_type: 'offline', prompt: 'consent' },
      },
    }),
  ],

  callbacks: {
    async signIn({ account }) {
      return account?.provider === 'google';
    },

    async jwt({ token, account, profile }) {
      // On initial sign-in, persist the provider credentials and exchange for a backend JWT.
      if (account) {
        const provider = 'google' as const;

        // Store provider credentials so the exchange can be retried on session refresh
        // if the backend was temporarily unreachable during sign-in.
        token.oauthProvider = provider;
        token.oauthToken = account.id_token ?? account.access_token ?? '';

        try {
          const result = await exchangeOAuthToken(provider, token.oauthToken as string);
          token.backendToken = result.token;
          token.backendTokenIssuedAt = Date.now();
          token.user = result.user;
        } catch (err) {
          // Backend unreachable at sign-in time — populate user from NextAuth profile
          // so the session is usable. The exchange will be retried below on next refresh.
          console.error('[Auth] backend exchange failed at sign-in:', err);
          const p = profile as Record<string, unknown> | undefined;
          token.user = {
            name:  (p?.name ?? p?.given_name ?? token.name ?? 'User') as string,
            email: (p?.email ?? token.email ?? '') as string,
            image: (p?.picture ?? p?.image ?? token.picture ?? undefined) as string | undefined,
            role:  'user',
          };
        }

        return token;
      }

      // On subsequent session refreshes, retry the backend exchange if backendToken
      // is missing (backend was down at sign-in) or approaching its 7-day expiry.
      const issuedAt = token.backendTokenIssuedAt as number | undefined;
      const SIX_DAYS_MS = 6 * 24 * 60 * 60 * 1000;
      const needsRefresh = !token.backendToken || (issuedAt && Date.now() - issuedAt > SIX_DAYS_MS);

      if (needsRefresh && token.oauthProvider && token.oauthToken) {
        try {
          const result = await exchangeOAuthToken(
            token.oauthProvider as 'google' | 'facebook',
            token.oauthToken as string,
          );
          token.backendToken = result.token;
          token.backendTokenIssuedAt = Date.now();
          token.user = result.user;
        } catch {
          // Still unreachable — clear the expired token so the UI shows "session expired"
          // rather than silently sending a stale/missing token.
          if (issuedAt && Date.now() - issuedAt > SIX_DAYS_MS) {
            token.backendToken = undefined;
            token.backendTokenIssuedAt = undefined;
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token.user) session.user  = token.user as typeof session.user;
      if (token.backendToken) session.backendToken = token.backendToken as string;
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error:  '/login',
  },

  session: { strategy: 'jwt' },
};
