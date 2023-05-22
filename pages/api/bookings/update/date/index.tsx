import { NextApiRequest, NextApiResponse } from 'next'
import { changeBookingDate } from 'services/bookingService'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  const { bookingId, showDate } = req.body

  try {
    const results = await changeBookingDate(parseInt(bookingId), new Date(showDate))
    res.status(200).json(results)
  } catch (e) {
    console.log(e)
    res.status(500)
  }
}
