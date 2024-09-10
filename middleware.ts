import { NextResponse } from 'next/server';
import { authMiddleware, clerkClient } from '@clerk/nextjs';
import axios from 'axios';

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

const checkAccessPaths = ['/api/account-user/read', '/api/account-user/verify'];

const getEmailAddressForClerkId = async (userId: string): Promise<string> => {
  const user = await clerkClient.users.getUser(userId);
  const matching = user.emailAddresses.filter((x) => x.id === user.primaryEmailAddressId)[0];
  return matching.emailAddress;
};

const isPublic = (path: string) => {
  return publicPaths.find((x) => path.match(new RegExp(`^${x}$`.replace('*$', '($|/)'))));
};

export default authMiddleware({
  afterAuth: async (auth, request) => {
    if (isPublic(request.nextUrl.pathname)) {
      return NextResponse.next();
    }

    // if the user is not signed in redirect them to the sign in page.
    const { userId } = auth;

    if (!userId) {
      const signInUrl = new URL('/auth/sign-in', request.url);
      return NextResponse.redirect(signInUrl);
    }

    const userEmail = await getEmailAddressForClerkId(userId);

    // User has a clerk session so any api calls to get account details should be allowed
    if (userEmail && checkAccessPaths.includes(request.nextUrl.pathname)) {
      return NextResponse.next();
    }

    // Check for user session
    const { data } = await axios(`${request.url}/api/user/session/verify?email=${userEmail}`);

    if (!data.isActive) {
      const signInUrl = new URL('/auth/sign-in?selectAccount=true', request.url);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  },
});

export const config = { matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'] };
