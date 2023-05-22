import { deleteBookingById } from 'services/bookingService'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  // reset booking id to blank booking
  try {
    const bookingId = parseInt(req.body.bookingId)
    await deleteBookingById(bookingId)
    console.log(`Deleted: ${bookingId}`)
    res.status(200).json({})
  } catch (e) {
    console.log(e)
    res.status(500)
  }
}
