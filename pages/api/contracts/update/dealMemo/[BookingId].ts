import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId: number = parseInt(req.query.BookingId as string);

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();

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

    await res.json(updateResult);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while updating deal memo.' });
  }
}
