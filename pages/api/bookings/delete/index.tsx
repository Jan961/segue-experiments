import { clearBookingById } from 'services/bookingService'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  // reset booking id to blank booking
  try {
    const bookingId = parseInt(req.body.bookingId)

    const booking = await clearBookingById(bookingId)
    console.log(`Deleted: ${bookingId}`)
    res.status(200).json(booking)
  } catch (e) {
    console.log(e)
  }
}
