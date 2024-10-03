import { loggingService } from 'services/loggingService';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export type BookingAttachedFile = {
  FileId: number;
  FileBookingBookingId: number;
  FileDescription: string;
  FileOriginalFilename: string;
  FileDateTime: Date;
  FileUploadedDateTime: Date;
  FileUrl: string;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = req.body as BookingAttachedFile;
    const prisma = await getPrismaClient(req);

    const result = await prisma.bookingAttachedFile.create({
      data,
    });
    res.status(200).json(result);
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error creating BookingAttachedFile' });
  }
}
