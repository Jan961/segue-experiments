import { Clerk } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { authMiddleware } from '@clerk/nextjs';
import prisma from 'lib/prisma';

const publicPaths = ['/api/user*', '/api/account*', '/auth*', '/sign-in*', '/sign-up*', '/access-denied'];

const clerk = Clerk({ apiKey: process.env.CLERK_SECRET_KEY });

const isPublic = (path: string) => {
  return publicPaths.find((x) => path.match(new RegExp(`^${x}$`.replace('*$', '($|/)'))));
};

export default authMiddleware({
  afterAuth: async (auth, request) => {
    if (isPublic(request.nextUrl.pathname)) return NextResponse.next();

    // if the user is not signed in redirect them to the sign in page.
    const { userId } = auth;

    if (!userId) {
      console.log('User Id not found');
      // redirect the users to /pages/sign-in/[[...index]].ts
      const signInUrl = new URL('/sign-in', request.url);
      return NextResponse.redirect(signInUrl);
    }

    if (userId) {
      const user = await clerk.users.getUser(userId);
      const userEmail = user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId).emailAddress;
      /*
        Uses MIDDLEWARE_DATABASE_URL in .env
        This is as standard database calls don't work on Vercel Edge. This middleware flagged an error if you tried a lookup
        https://www.prisma.io/docs/data-platform/classic-projects/data-proxy/use-data-proxy#enable-the-data-proxy-for-a-project
      */
      const access = await prisma.user.findUnique({ where: { Email: userEmail }, select: { Id: true } });

      if (access) return NextResponse.next();
      const denied = new URL('/access-denied', request.url);
      return NextResponse.redirect(denied);
    }

    return NextResponse.next();
  },
});

export const config = { matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'] };
