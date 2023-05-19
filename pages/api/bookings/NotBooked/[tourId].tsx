import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const TourID = req.query.tourId

    const searchResults = await prisma.booking.findMany({
      where: {
        TourId: parseInt(TourID as string),
        AND: [
          {
            DayTypeCrew: 1, // null
            DayTypeCast: 1, // null
            VenueId: null
          }
        ]
      },
      select: {
        BookingId: true,
        ShowDate: true
      }
    })
    res.json(searchResults)
  } catch (err) {
    console.log(err)
    res.status(403).json({ err: 'Error occurred while generating search results.' })
  }
}
