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
    const updateDealMemoPrice = await prisma.dealMemoCall.delete({
      where: {
        DMPDeMoId: data.DMPDeMoId,
        DMPId: data.DMPId,
      },
    });

    await res.json(updateDealMemoPrice);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while generating search results.' });
  }
}
