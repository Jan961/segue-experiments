import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId: number = parseInt(req.query.BookingId as string);
    const prisma = await getPrismaClient(req);

    const data = req.body;

    const result = await prisma.contractFile.create({
      data: { ...data, ContractBookingId: BookingId },
    });

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while creating the contract file' });
  }
}
