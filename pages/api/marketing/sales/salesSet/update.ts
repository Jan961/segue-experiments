import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { BookingId, SalesFigureDate, ...updatedData } = req.body;

    console.log(req.body);

    if (!BookingId) return res.status(400).end();
    const prisma = await getPrismaClient(req);
    const updatedSaleSet = await prisma.salesSet.updateMany({
      where: {
        SetBookingId: BookingId,
        SetSalesFiguresDate: new Date(SalesFigureDate),
      },
      data: updatedData,
    });
    res.status(200).json({ ok: true, ...updatedSaleSet });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err, ok: false });
  }
}
