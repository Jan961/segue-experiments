import { activityMapper } from 'lib/mappers'
import prisma from 'lib/prisma'

export default async function handle (req, res) {
  try {
    const BookingId = parseInt(req.query.BookingId)
    const results = await prisma.bookingActivity.findMany({
      where: {
        BookingId
      }
    })

    res.json(results.map(activityMapper))
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: 'Error occurred while generating search results.' })
  }
}
