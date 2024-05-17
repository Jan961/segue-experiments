import { loggingService } from 'services/loggingService';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

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
    console.log(req.body);

    const data = req.body as BookingAttachedFile;

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId: data.FileBookingBookingId });
    if (!access) return res.status(401).end();

    await prisma.bookingAttachedFile.create({
      data,
    });
    res.status(200).json({});
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error creating BookingAttachedFile' });
  }
}
