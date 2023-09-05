import { bookingMapper } from 'lib/mappers'
import { createBooking } from 'services/bookingService'
import { loggingService } from 'services/loggingService'
import { checkAccess, getEmailFromReq } from 'services/userService'

export interface CreateBookingsParams {
  Date: string
  DateBlockId: number
  VenueId: number
}

export default async function handle (req, res) {
  try {
    const data = req.body as CreateBookingsParams
    const { DateBlockId, VenueId } = data

    const email = await getEmailFromReq(req)
    const access = await checkAccess(email, { DateBlockId })
    if (!access) return res.status(401)

    const created = await createBooking(VenueId, new Date(data.Date), DateBlockId)
    res.status(200).json(bookingMapper(created))
  } catch (e) {
    console.log(e)
    await loggingService.logError(e)
    res.status(500).json({ err: 'Error creating booking' })
  }
}
