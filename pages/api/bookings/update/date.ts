import { bookingMapper } from 'lib/mappers'
import { NextApiRequest, NextApiResponse } from 'next'
import { changeBookingDate } from 'services/bookingService'

export interface UpdateDateParams {
  date: string
  bookingId: number
}

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  const { bookingId, date } = req.body as UpdateDateParams

  try {
    const result = await changeBookingDate(bookingId, new Date(date))

    if (result) {
      console.log(result)
      res.status(200).json(bookingMapper(result))
    }
    res.status(404).json({})
  } catch (e) {
    console.log(e)
    res.status(500).json({ err: 'Error updating date' })
  }
}
