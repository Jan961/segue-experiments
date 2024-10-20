import { loggingService } from 'services/loggingService';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { BookingFileId, BookingFileBookingId, BookingFileFileId, BookingFileType, BookingFileDescription } =
      req.body;

    const prisma = await getPrismaClient(req);

    await prisma.bookingFile.update({
      where: {
        BookingFileId,
      },
      data: {
        BookingFileBookingId,
        BookingFileFileId,
        BookingFileType,
        BookingFileDescription,
      },
    });
    res.status(200).json({});
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error updating BookingFile' });
  }
}
