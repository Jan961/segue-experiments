import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { newDate } from 'services/dateService';

let prisma = null;

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { BookingId, SalesFigureDate, ...updatedData } = req.body;
    if (!BookingId) return res.status(400).end();
    prisma = await getPrismaClient(req);

    const result = updatedData.SetNotOnSale
      ? setNotOnSale(BookingId, SalesFigureDate, updatedData)
      : removeNotOnSale(BookingId, SalesFigureDate, updatedData);
    res.status(200).json({ ok: true, result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err, ok: false });
  }
}

async function setNotOnSale(BookingId: string, SalesFigureDate: string, updatedData: any) {
  const updatedSaleSet = await prisma.SalesSet.updateMany({
    where: {
      SetBookingId: BookingId,
      SetSalesFiguresDate: {
        lte: newDate(SalesFigureDate),
      },
    },
    data: updatedData,
  });
  return updatedSaleSet;
}

async function removeNotOnSale(BookingId: string, SalesFigureDate: string, updatedData: any) {
  const updatedSaleSet = await prisma.SalesSet.updateMany({
    where: {
      SetBookingId: BookingId,
      SetSalesFiguresDate: {
        gte: newDate(SalesFigureDate),
      },
      SetNotOnSale: true,
    },
    data: updatedData,
  });
  return updatedSaleSet;
}
