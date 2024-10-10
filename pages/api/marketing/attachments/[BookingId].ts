import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId = parseInt(req.query.BookingId as string);
    const prisma = await getPrismaClient(req);

    const attachments = await prisma.bookingFile.findMany({
      where: {
        BookingFileBookingId: BookingId,
      },
    });

    res.json(attachments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while generating search results.' });
  }
}
