import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { newDate } from 'services/dateService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { BookingId, SalesFigureDate, ...updatedData } = req.body;
    if (!BookingId) return res.status(400).end();
    const prisma = await getPrismaClient(req);

    const result = await prisma.salesSet.updateMany({
      where: {
        SetBookingId: BookingId,
        SetSalesFiguresDate: {
          gte: newDate(SalesFigureDate),
        },
      },
      data: updatedData,
    });
    res.status(200).json({ ok: true, result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err, ok: false });
  }
}
