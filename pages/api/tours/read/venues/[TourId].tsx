import prisma from 'lib/prisma'
import { omit, pick } from 'radash'

export default async function handle (req, res) {
  try {
    const TourId = parseInt(req.query.TourId)
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
              Venue: true
            }
          }
        },
        orderBy: {
          StartDate: 'desc'
        }
      }
    )
    res.json({ data: result.Booking.map(booking => ({ booking: omit(booking, ['Venue']), ...booking.Venue, BookingId: booking.Id })) })
    // res.json(result)
  } catch (error) {
    console.log('==Error fetching Venue bookings==', error)
    res.status(500).send()
  }
}
