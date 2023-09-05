import { clerkClient } from '@clerk/nextjs'
import { getAuth } from '@clerk/nextjs/server'
import prisma from 'lib/prisma'

interface AccessCheck {
  ShowId?: number
  TourId?: number
  AccountId?: number
  DateBlockId?: number
  BookingId?: number
  OtherId?: number
  GifuId?: number
  PerformanceId?: number
  RehearsalId?: number
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

export const getAccountIdFromReq = async (req: any) => {
  const email = await getEmailFromReq(req)
  return getAccountId(email)
}

// Check access based on the second paramater. Can pass multiple to it if wanted (but will increase workload)
export const checkAccess = async (email: string, items: AccessCheck): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: {
      Email: email
    }
  })

  if (!user) return false

  // We just need the minimal for checking existence
  const select = {
    Id: true
  }

  // We default to true for simple user checks
  const successes = [true]

  // Show
  if (items.ShowId) {
    const show = await prisma.show.findFirst({
      where: {
        Id: items.ShowId,
        AccountId: user.AccountId
      },
      select
    })
    successes.push(!!show)
  }

  // Tour
  if (items.TourId) {
    const tour = await prisma.tour.findFirst({
      where: {
        Id: items.TourId,
        Show: {
          is: {
            AccountId: user.AccountId
          }
        }
      },
      select
    })
    successes.push(!!tour)
  }

  // DateBlock
  if (items.DateBlockId) {
    const dateblock = await prisma.dateBlock.findFirst({
      where: {
        Id: items.DateBlockId,
        Tour: {
          is: {
            Show: {
              is: {
                AccountId: user.AccountId
              }
            }
          }
        }
      },
      select
    })
    successes.push(!!dateblock)
  }

  // Shared for all event types, gifu, booking, rehearsal etc.
  const EventWhere = {
    DateBlock: {
      is: {
        Tour: {
          is: {
            Show: {
              is: {
                AccountId: user.AccountId
              }
            }
          }
        }
      }
    }
  }

  // Booking
  if (items.BookingId) {
    const booking = await prisma.booking.findFirst({
      where: {
        Id: items.BookingId,
        ...EventWhere
      },
      select
    })
    successes.push(!!booking)
  }

  // Rehearsal
  if (items.RehearsalId) {
    const rehearsal = await prisma.rehearsal.findFirst({
      where: {
        Id: items.RehearsalId,
        ...EventWhere
      },
      select
    })

    successes.push(!!rehearsal)
  }

  // Get In Fit Up (GIFU)
  if (items.GifuId) {
    const gifu = await prisma.getInFitUp.findFirst({
      where: {
        Id: items.GifuId,
        ...EventWhere
      },
      select
    })

    successes.push(!!gifu)
  }

  // Other
  if (items.OtherId) {
    const other = await prisma.other.findFirst({
      where: {
        Id: items.OtherId,
        ...EventWhere
      },
      select
    })
    successes.push(!!other)
  }

  // Performance
  if (items.PerformanceId) {
    const perf = await prisma.performance.findFirst({
      where: {
        Id: items.PerformanceId,
        // Slightly different. This is based on booking
        Booking: {
          is: EventWhere
        }
      },
      select
    })

    successes.push(!!perf)
  }

  return successes.filter(x => !x).length === 0
}
