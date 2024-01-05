import prisma from 'lib/prismaAccelerate';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkAccess, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { BookingId, SalesFigureDate, ...updatedData } = req.body;
    if (!BookingId) return res.status(400).end();
    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId });
    if (!access) return res.status(401).end();
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
        lte: new Date(SalesFigureDate),
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
        gte: new Date(SalesFigureDate),
      },
      SetNotOnSale: true,
    },
    data: updatedData,
  });
  return updatedSaleSet;
}
