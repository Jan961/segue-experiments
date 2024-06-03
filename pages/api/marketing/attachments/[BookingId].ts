import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId = parseInt(req.query.BookingId as string);

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId });
    if (!access) return res.status(401).end();

    const attachments = await prisma.bookingAttachedFile.findMany({
      where: {
        FileBookingBookingId: BookingId,
      },
    });

    res.json(attachments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while generating search results.' });
  }
}