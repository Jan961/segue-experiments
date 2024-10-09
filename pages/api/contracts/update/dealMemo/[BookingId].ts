import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId: number = parseInt(req.query.BookingId as string);
    const prisma = await getPrismaClient(req);

    const updateResult = await prisma.dealMemo.update({
      where: {
        BookingId,
      },
      data: {
        Status: req.body?.Status,
        CompletedBy: req.body?.CompletedBy,
        ApprovedBy: req.body?.ApprovedBy,
        DateIssued: req.body?.DateIssued,
        DateReturned: req.body?.DateReturned,
        Notes: req.body?.Notes,
      },
    });

    res.status(200).json(updateResult);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while updating deal memo.' });
  }
}
