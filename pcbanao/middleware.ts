export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/builder/:path*',
    '/builds/:path*',
    '/checkout/:path*',
  ],
};
