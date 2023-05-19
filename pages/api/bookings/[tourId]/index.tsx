import { NextApiRequest, NextApiResponse } from 'next'
import { getBookingsByTourId } from 'services/bookingService'
import prisma from 'lib/prisma'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const tourId = req.query.tourId
    const searchResults = await getBookingsByTourId(parseInt(tourId as string))
    res.json(searchResults)
  } catch (err) {
    console.log(err)
    res.status(403).json({ err: 'Error occurred while generating search results.' })
  }
}
