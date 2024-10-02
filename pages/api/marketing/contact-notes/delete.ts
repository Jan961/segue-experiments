import { loggingService } from 'services/loggingService';
import getPrismaClient from 'lib/prisma';
import { BookingContactNoteDTO } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const bcn = req.body as BookingContactNoteDTO;
    const prisma = await getPrismaClient(req);

    await prisma.bookingContactNotes.delete({
      where: {
        Id: bcn.Id,
      },
    });
    res.status(200).json({});
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error deleting BookingContactNote' });
  }
}
