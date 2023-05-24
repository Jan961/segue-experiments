import { NextApiRequest, NextApiResponse } from 'next'
import { loggingService } from 'services/loggingService'
import { updateBooking } from 'services/bookingService'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    // Parse the body
    const booking = {
      BookingId: req.body.BookingId,
      VenueId: parseInt(req.body.VenueId),
      Notes: req.body.Notes,
      BookingStatus: req.body.BookingStatus,
      DayTypeCast: parseInt(req.body.DayTypeCast),
      LocationCast: req.body.LocationCast,
      DayTypeCrew: parseInt(req.body.DayTypeCast),
      LocationCrew: req.body.LocationCrew
    }

    const updated = await updateBooking(booking)

    res.json(updated)
  } catch (e) {
    loggingService.logError(e)
      .then(() => {
        res.status(500)
      })
  }
}
