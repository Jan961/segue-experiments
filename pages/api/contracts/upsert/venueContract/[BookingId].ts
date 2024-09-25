import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';
import { isNullOrEmpty } from 'utils';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId: number = parseInt(req.query.BookingId as string);

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId });
    if (!access) return res.status(401).end();
    const recordFound = await prisma.contract.findFirst({ where: { BookingId } });
    if (isNullOrEmpty(recordFound)) {
      const newRecord = await prisma.contract.create({
        data: {
          BookingId,
          ...req.body,
        },
      });
      return res.status(200).json(newRecord);
    } else {
      const updateResult = await prisma.contract.update({
        where: {
          BookingId,
        },
        data: req.body,
      });
      return res.status(200).json(updateResult);
    }
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while generating search results.' });
  }
}