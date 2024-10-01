import { loggingService } from 'services/loggingService';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { BookingAttachedFile } from 'prisma/generated/prisma-client';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = req.body as BookingAttachedFile;
    const prisma = await getPrismaClient(req);

    await prisma.bookingAttachedFile.delete({
      where: {
        FileId: data.FileId,
      },
    });
    res.status(200).json({});
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error deleting BookingAttachedFile' });
  }
}
