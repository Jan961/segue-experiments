import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId: number = parseInt(req.query.BookingId as string);

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId });
    if (!access) return res.status(401).end();
    const data = req.body;
    console.log('data==>', data);
    // const updatedData = req.body;
    delete data.error;
    const existingDealMemo = await prisma.dealMemo.findFirst({
      where: {
        DeMoBookingId: BookingId,
      },
    });
    let updateCreateDealMemo;

    if (existingDealMemo) {
      updateCreateDealMemo = await prisma.dealMemo.update({
        where: {
          DeMoBookingId: BookingId,
        },
        data: {
          ...data,
          Booking: {
            connect: { Id: BookingId },
          },
        },
      });
    } else {
      updateCreateDealMemo = await prisma.dealMemo.create({
        data: {
          ...data,
          Booking: {
            connect: { Id: BookingId },
          },
        },
      });
    }
    await res.json(updateCreateDealMemo);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while generating search results.' });
  }
}
