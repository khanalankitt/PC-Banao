import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { exchangeOAuthToken } from '@/lib/auth/authApi';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId:     process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ account }) {
      // Only allow configured providers; block any unexpected ones
      return account?.provider === 'google' || account?.provider === 'facebook';
    },

    async jwt({ token, account }) {
      // On initial sign-in, exchange the provider access token for our backend JWT
      if (account?.access_token) {
        const result = await exchangeOAuthToken(
          account.provider as 'google' | 'facebook',
          account.access_token,
        );
        token.backendToken = result.token;
        token.user = result.user;
      }
      return token;
    },

    async session({ session, token }) {
      session.backendToken = token.backendToken as string;
      session.user = token.user as typeof session.user;
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error:  '/login',
  },

  session: { strategy: 'jwt' },
};
