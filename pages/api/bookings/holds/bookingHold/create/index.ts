import { loggingService } from 'services/loggingService'
import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { checkAccess, getEmailFromReq } from 'services/userService'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  const BookingId = parseInt(req.body.BookingId)

  const email = await getEmailFromReq(req)
  const access = await checkAccess(email, { BookingId })
  if (!access) return res.status(401)

  try {
    const createHolds = await prisma.bookingPromoterHoldAvailable.create({
      data: {
        BookingId,
        Performance: parseInt(req.body.Performance),
        Seats: parseInt(req.body.Seats),
        Notes: req.body.Notes
      }
    })
    res.status(200).json(createHolds)
  } catch (e) {
    await loggingService.logError(e)
    return res.status(400)
  }
}
