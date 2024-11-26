import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId = parseInt(req.query.BookingId as string);
    const prisma = await getPrismaClient(req);

    // get BookingFile records for the booking
    const attachments = await prisma.bookingFile.findMany({
      where: {
        BookingFileBookingId: BookingId,
      },
      include: {
        File: true,
      },
    });

    const result = attachments.map(({ File, ...rest }) => ({
      ...rest,
      ...File,
    }));

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while generating search results.' });
  }
}
