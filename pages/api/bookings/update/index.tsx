import { NextApiRequest, NextApiResponse } from 'next'
import { updateBooking } from 'services/bookingService'
import { BookingDTO } from 'interfaces'
import { Booking } from '@prisma/client'
import { bookingMapper } from 'lib/mappers'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const inc = req.body as BookingDTO

    const booking: Partial<Booking> = {
      Id: inc.Id, // Where
      // Dateblock never change
      FirstDate: new Date(inc.Date),
      StatusCode: inc.StatusCode,
      VenueId: inc.VenueId,
      PencilNum: inc.PencilNum,
      LandingPageURL: inc.LandingSite,
      TicketsOnSaleFromDate: inc.OnSaleDate ? new Date(inc.OnSaleDate) : null,
      TicketsOnSale: inc.OnSale
    }

    const updated = await updateBooking(booking as Booking)
    const mapped = bookingMapper(updated)

    res.json(mapped)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err })
  }
}
