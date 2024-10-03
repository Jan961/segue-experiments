import { bookingContactNoteMapper } from 'lib/mappers';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId = parseInt(req.query.BookingId as string);
    const prisma = await getPrismaClient(req);

    const results = await prisma.bookingContactNotes.findMany({
      where: {
        BookingId,
      },
      orderBy: {
        ContactDate: 'desc',
      },
    });

    res.json(results.map(bookingContactNoteMapper));
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while generating search results.' });
  }
}
