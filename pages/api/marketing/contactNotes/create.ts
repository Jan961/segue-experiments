import { loggingService } from 'services/loggingService'
import prisma from 'lib/prisma'
import { BookingContactNoteDTO } from 'interfaces'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const bcn = req.body as BookingContactNoteDTO

    await prisma.bookingContactNotes.create({
      data: {
        BookingId: bcn.BookingId,
        Notes: bcn.Notes,
        ContactDate: bcn.ContactDate ? new Date(bcn.ContactDate) : null,
        ActionByDate: bcn.ActionByDate ? new Date(bcn.ActionByDate) : null,
        CoContactName: bcn.CoContactName
      }
    })
    res.status(200).json({})
  } catch (err) {
    await loggingService.logError(err)
    console.log(err)
    res.status(500).json({ err: 'Error creating BookingContactNote' })
  }
}
