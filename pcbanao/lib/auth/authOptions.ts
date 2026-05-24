import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { exchangeOAuthToken } from '@/lib/auth/authApi';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Request offline access so we always get an access_token
      authorization: {
        params: { access_type: 'offline', prompt: 'consent' },
      },
    }),
    FacebookProvider({
      clientId:     process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ account }) {
      return account?.provider === 'google' || account?.provider === 'facebook';
    },

    async jwt({ token, account, profile }) {
      // On initial sign-in, exchange the OAuth token for a backend JWT.
      if (account) {
        const provider = account.provider as 'google' | 'facebook';

        // For Google prefer id_token (self-contained JWT with user info),
        // fall back to access_token. For Facebook use access_token.
        const tokenToExchange =
          provider === 'google'
            ? (account.id_token ?? account.access_token ?? '')
            : (account.access_token ?? '');

        try {
          const result = await exchangeOAuthToken(provider, tokenToExchange);
          token.backendToken = result.token;
          token.backendTokenIssuedAt = Date.now();
          token.user = result.user;
        } catch (err) {
          // Backend unreachable — populate user from NextAuth profile so
          // the session still works and the user is shown as logged in.
          console.error('[Auth] backend exchange failed, using provider profile:', err);
          const p = profile as Record<string, unknown> | undefined;
          token.user = {
            name:  (p?.name ?? p?.given_name ?? token.name ?? 'User') as string,
            email: (p?.email ?? token.email ?? '') as string,
            image: (p?.picture ?? p?.image ?? token.picture ?? undefined) as string | undefined,
            role:  'user',
          };
          // leave token.backendToken undefined — session callback guards against it
        }

        return token;
      }

      // On subsequent calls (session refresh), re-issue the backend JWT
      // if it is within 1 day of the 7-day expiry to stay ahead of expiry.
      const issuedAt = token.backendTokenIssuedAt as number | undefined;
      const SIX_DAYS_MS = 6 * 24 * 60 * 60 * 1000;
      if (issuedAt && Date.now() - issuedAt > SIX_DAYS_MS) {
        // The backend token is 6+ days old — treat session as expired so
        // the user gets a clean re-login rather than silent 401 errors.
        token.backendToken = undefined;
        token.backendTokenIssuedAt = undefined;
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
