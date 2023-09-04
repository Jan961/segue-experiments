import { toSql } from 'services/dateService'
import prisma from 'lib/prisma'

export default async function handle (req, res) {
  // UNSECURED

  try {
    const tourID = parseInt(req.query.TourId)
    const date = toSql(req.query.Date)
    const bookings = await prisma.booking.findFirst({
      where: {
        TourId: tourID,
        ShowDate: {
          /**
                     * This is required due to prismas handeling of dates
                     */
          lte: new Date(date).toISOString(), // "2022-01-30T00:00:00.000Z"
          gte: new Date(date).toISOString() // "2022-01-15T00:00:00.000Z"
        }
      }
    })

    res.json(bookings)
  } catch (err) {
    console.log(err)
    res.status(403).json({ err: 'Error occurred while generating search results.' })
  }
}
