import { clerkClient } from '@clerk/nextjs'
import { getAuth } from '@clerk/nextjs/server'
import prisma from 'lib/prisma'

interface AccessCheck {
  ShowId?: number
  TourId?: number
  AccountId?: number
  DateBlockId?: number
}

export const getEmailAddressForClerkId = async (userId: string): Promise<string> => {
  const user = await clerkClient.users.getUser(userId)
  const matching = user.emailAddresses.filter(x => x.id === user.primaryEmailAddressId)[0]
  return matching.emailAddress
}

export const getAccountId = async (email: string) => {
  const { AccountId } = await prisma.user.findUnique(
    {
      where: {
        Email: email
      },
      select: {
        AccountId: true
      }
    }
  )

  return AccountId
}

export const getEmailFromReq = async (req: any) => {
  const { userId } = getAuth(req)
  return getEmailAddressForClerkId(userId)
}

export const checkAccess = async (email: string, items: AccessCheck): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: {
      Email: email
    }
  })

  if (!user) return false

  // We default to true for simple user checks
  const successes = [true]

  if (items.ShowId) {
    const show = await prisma.show.findUnique({
      where: {
        Id: items.ShowId,
        AccountId: user.AccountId
      },
      select: {
        Id: true,
        AccountId: true
      }
    })

    successes.push(!!show)
  }
  if (items.TourId) {
    const tour = await prisma.tour.findMany({
      where: {
        Id: items.TourId,
        Show: {
          is: {
            AccountId: user.AccountId // replace with the ID you're looking for
          }
        }
      },
      select: {
        Id: true
      }
    })

    successes.push(tour.length > 0)
  }
  if (items.DateBlockId) {
    const dateblock = await prisma.dateblock.findFirst({
      where: {
        Id: items.DateBlockId,
        Tour: {
          is: {
            Show: {
              is: {
                AccountId: user.AccountId // replace with the ID you're looking for
              }
            }
          }
        }
      },
      select: {
        Id: true
      }
    })

    successes.push(dateblock.length > 0)
  }

  return successes.filter(x => !x).length === 0
}
