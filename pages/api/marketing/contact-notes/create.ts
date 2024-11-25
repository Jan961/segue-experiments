import { loggingService } from 'services/loggingService';
import getPrismaClient from 'lib/prisma';
import { BookingContactNoteDTO } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import { safeDate } from 'services/dateService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const bcn = req.body as BookingContactNoteDTO;
    const prisma = await getPrismaClient(req);

    const result = await prisma.bookingContactNotes.create({
      data: {
        BookingId: bcn.BookingId,
        Notes: bcn.Notes,
        ContactDate: bcn.ContactDate ? safeDate(bcn.ContactDate) : null,
        CoContactName: bcn.CoContactName,
        ActionAccUserId: bcn.ActionAccUserId,
      },
    });
    res.status(200).json(result);
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error creating BookingContactNote' });
  }
}
