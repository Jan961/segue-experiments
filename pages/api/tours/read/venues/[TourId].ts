import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { omit } from 'radash'
import { getEmailFromReq, checkAccess } from 'services/userService'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const TourId = parseInt(req.query.TourId as string)

    const email = await getEmailFromReq(req)
    const access = await checkAccess(email, { TourId })
    if (!access) return res.status(401).end()

    // TO be implimnented when Prisma supports this
    const result = await prisma.DateBlock.findFirst(
      {
        where: {
          TourId,
          Name: 'Tour'
        },
        include: {
          Booking: {
            include: {
              Venue: {
                include: {
                  VenueAddress: true
                }
              }
            }
          }
        },
        orderBy: {
          StartDate: 'desc'
        }
      }
    )
    const bookings = result.Booking.map(booking => ({ booking: omit(booking, ['Venue']), ...(booking.Venue || {}), ...(booking.Venue?.VenueAddress?.[0] || {}), BookingId: booking.Id }))
    res.json(bookings)
  } catch (error) {
    console.log('==Error fetching Venue bookings==', error)
    res.status(500).end()
  }
}
