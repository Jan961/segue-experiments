import { loggingService } from 'services/loggingService';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';
import { VenueTechSpecsAttachedFile } from './create';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = req.body as VenueTechSpecsAttachedFile;

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId: data.FileBookingBookingId });
    if (!access) return res.status(401).end();

    await prisma.bookingAttachedFile.update({
      where: {
        FileId: data.FileId,
      },
      data: {
        FileOriginalFilename: data.FileOriginalFilename,
      },
    });
    res.status(200).json({});
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error updating BookingAttachedFile' });
  }
}
