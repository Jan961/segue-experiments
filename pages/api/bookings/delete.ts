import { deleteBookingById } from 'services/bookingService'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const bookingId = parseInt(req.body.bookingId)
    await deleteBookingById(bookingId)
    console.log(`Deleted: ${bookingId}`)
    return res.status(200).json({})
  } catch (e) {
    console.log(e)
    return res.status(500).json({ err: 'Error Deleting Booking' })
  }
}
