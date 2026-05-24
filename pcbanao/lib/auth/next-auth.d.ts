import { DefaultSession, DefaultJWT } from 'next-auth';
import { BackendUser } from './authApi';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    backendToken: string;
    user: BackendUser;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    backendToken?: string;
    backendTokenIssuedAt?: number;
    user?: BackendUser;
  }
}
