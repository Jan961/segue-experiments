import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const lastBookingDate = await prisma.booking.findFirst({
      select: {
        FirstDate: true,
      },
      orderBy: {
        FirstDate: 'desc',
      },
    });
    console.log(`Last Booking Date: ${lastBookingDate}`);
    res.status(200).json(lastBookingDate);
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Error Creating Performance' });
  }
}
