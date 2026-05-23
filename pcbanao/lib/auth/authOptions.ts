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
      // Only run on initial sign-in — when account is present
      if (!account) return token;

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
