import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId: number = parseInt(req.query.BookingId as string);

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId });
    if (!access) return res.status(401).end();
    console.log('BookingId', BookingId);
    const data = {
      DeMoBookingId: BookingId,
      DeMoAccContId: 1,
    };
    // const updatedData = req.body;
    const getDealMemo = await prisma.dealMemo.create({
      //   where: {
      //     DeMoBookingId : BookingId,
      //   },
      data,
    });

    await res.json(getDealMemo);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while generating search results.' });
  }
}
