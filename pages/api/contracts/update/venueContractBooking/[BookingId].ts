import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const prisma = await getPrismaClient(req);
    let bookingdata = req.body;
    if (req.body.bookingNotes) {
      bookingdata = { ...bookingdata, Notes: req.body.bookingNotes };
      delete bookingdata.bookingNotes;
    }
    const BookingId: number = parseInt(req.query.BookingId as string);

    const updateResult = await prisma.booking.update({
      where: {
        Id: BookingId,
      },
      data: bookingdata,
    });

    await res.json(updateResult);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while generating search results.' });
  }
}
