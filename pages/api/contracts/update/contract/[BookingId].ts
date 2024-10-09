import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId: number = parseInt(req.query.BookingId as string);
    const prisma = await getPrismaClient(req);

    const updateResult = await prisma.contract.updateMany({
      where: {
        BookingId,
      },
      data: {
        ...req.body,
      },
    });

    await res.json(updateResult);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while generating search results.' });
  }
}
