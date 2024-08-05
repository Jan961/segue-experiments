import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('creating attachment');
    const BookingId: number = parseInt(req.query.BookingId as string);

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId });
    if (!access) return res.status(401).end();

    const data = req.body;

    const result = await prisma.ContractFile.create({
      data: { ...data, ContractBookingId: BookingId },
    });

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while creating the contract file' });
  }
}
