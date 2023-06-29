import { Clerk } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { authMiddleware } from '@clerk/nextjs'

const allowedEmails = [
  'neil@neilsutcliffe.com',
  'robert@robertckelly.co.uk',
  'kyle@chieftechofficer.co.uk',
  'asara97911@gmail.com',
  'k@bhikstudio.co.uk'
]
const publicPaths = ['/sign-in*', '/sign-up*', '/access-denied']

const clerk = Clerk({ apiKey: process.env.CLERK_SECRET_KEY })

const isPublic = (path: string) => {
  return publicPaths.find(x =>
    path.match(new RegExp(`^${x}$`.replace('*$', '($|/)')))
  )
}

export default authMiddleware({
  afterAuth: async (auth, request, evt) => {
    if (isPublic(request.nextUrl.pathname)) return NextResponse.next()

    // if the user is not signed in redirect them to the sign in page.
    const { userId } = auth

    if (!userId) {
      // redirect the users to /pages/sign-in/[[...index]].ts
      const signInUrl = new URL('/sign-in', request.url)
      return NextResponse.redirect(signInUrl)
    }

    if (userId) {
      const user = await clerk.users.getUser(userId)
      const userEmail = user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId).emailAddress

      if (allowedEmails.includes(userEmail)) return NextResponse.next()
      const denied = new URL('/access-denied', request.url)
      return NextResponse.redirect(denied)
    }

    return NextResponse.next()
  }
})

export const config = { matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'] }
