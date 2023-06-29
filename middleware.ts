import { Clerk } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { authMiddleware } from '@clerk/nextjs'

const allowedEmails = [
  'neil@neilsutcliffe.com',
  'robert@robertckelly.co.uk',
  'kyle@chieftechofficer.co.uk',
  'asara97911@gmail.com'
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
    if (isPublic(request.nextUrl.pathname)) {
      if (request.nextUrl.pathname === '/sign-in/sso-callback') {
        // Accidentally signed in when signing up
        const signUp = new URL('/sign-up?error=notfound', request.url)
        return NextResponse.redirect(signUp)
      }
      if (request.nextUrl.pathname === '/sign-up/sso-callback') {
        // Accidentially signed up when signing in
        console.log(auth)
        const signIn = new URL('/sign-in?error=exists', request.url)
        return NextResponse.redirect(signIn)
      }
      return NextResponse.next()
    }
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

      console.log('Email Not Found')
      const denied = new URL('/access-denied', request.url)
      return NextResponse.redirect(denied)
    }

    return NextResponse.next()
  }
})

export const config = { matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'] }
