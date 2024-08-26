import { NextResponse } from 'next/server';
import { authMiddleware } from '@clerk/nextjs';
const publicPaths = [
  '/api/user*',
  '/api/account*',
  '/api/email*',
  '/api/subscription-plans*',
  '/api/subscription*',
  '/api/payment*',
  '/sign-in*',
  '/account/sign-up',
  '/access-denied',
  '/auth/**',
];

const isPublic = (path: string) => {
  return publicPaths.find((x) => path.match(new RegExp(`^${x}$`.replace('*$', '($|/)'))));
};

export default authMiddleware({
  afterAuth: async (auth, request) => {
    if (isPublic(request.nextUrl.pathname)) return NextResponse.next();

    // if the user is not signed in redirect them to the sign in page.
    const { userId } = auth;

    if (!userId) {
      // redirect the users to /pages/sign-in/[[...index]].ts
      const signInUrl = new URL('/auth/sign-in', request.url);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  },
});

export const config = { matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'] };
