import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId = parseInt(req.query.bookingId as string);
    const prisma = await getPrismaClient(req);
    const createResult = await prisma.contract.create({
      data: {
        BookingId,
      },
    });

    return res.json(createResult);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while creating the contract.' });
  }
}
