import { bookingMapper } from 'lib/mappers'
import { createBooking } from 'services/bookingService'
import { loggingService } from 'services/loggingService'

export interface CreateBookingsParams {
  Date: string
  DateBlockId: number
  VenueId: number
}

export default async function handle (req, res) {
  try {
    const data = req.body as CreateBookingsParams
    const created = await createBooking(data.VenueId, new Date(data.Date), data.DateBlockId)
    res.status(200).json(bookingMapper(created))
  } catch (e) {
    console.log(e)
    await loggingService.logError(e)
    res.status(500).json({ err: 'Error creating booking' })
  }
}
