import { NextResponse } from 'next/server';
import { authMiddleware, clerkClient } from '@clerk/nextjs';
import { allowRoute } from 'config/apiConfig';
import { isNullOrEmpty } from 'utils';
import { ACCESS_DENIED_URL, SIGN_IN_URL } from 'config/auth';

const publicPaths = [
  '/api/user*',
  '/api/account*',
  '/api/account-user*',
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
    if (isPublic(request.nextUrl.pathname)) {
      return NextResponse.next();
    }
    const signInUrl = new URL(SIGN_IN_URL, request.url);

    // if the user is not signed in redirect them to the sign in page.
    const { userId } = auth;
    if (!userId) {
      return NextResponse.redirect(signInUrl);
    }
    const user = await clerkClient.users.getUser(userId);
    const { organisationId, permissions } = user.unsafeMetadata;

    if (!organisationId) {
      return NextResponse.redirect(signInUrl);
    }
    // Check user permissions
    const routeAllowed = allowRoute(request.nextUrl.pathname, permissions as string[]);

    if (isNullOrEmpty(permissions) || !routeAllowed) {
      const signInUrl = new URL(ACCESS_DENIED_URL, request.url);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  },
});

export const config = { matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'] };
