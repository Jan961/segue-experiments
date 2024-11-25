import { loggingService } from 'services/loggingService';
import getPrismaClient from 'lib/prisma';
import { BookingContactNoteDTO } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const bcn = req.body as BookingContactNoteDTO;
    const prisma = await getPrismaClient(req);

    await prisma.bookingContactNotes.update({
      where: {
        Id: bcn.Id,
      },
      data: {
        BookingId: bcn.BookingId,
        Notes: bcn.Notes,
        ContactDate: bcn.ContactDate ? bcn.ContactDate : null,
        ActionAccUserId: bcn.ActionAccUserId,
        CoContactName: bcn.CoContactName,
      },
    });
    res.status(200).json({});
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error updating VenueContact' });
  }
}
