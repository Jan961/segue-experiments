import { loggingService } from 'services/loggingService';
import prisma from 'lib/prisma';
import { BookingContactNoteDTO } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const bcn = req.body as BookingContactNoteDTO;
    const { BookingId } = bcn;

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId });
    if (!access) return res.status(401).end();

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
