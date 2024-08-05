import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId = parseInt(req.query.BookingId as string);
    console.log(BookingId);

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId });
    if (!access) return res.status(401).end();

    const contractFiles = (
      await prisma.ContractFile.findMany({
        where: {
          ContractBookingId: BookingId,
        },
        select: { FileId: true },
      })
    ).map((file) => file.FileId);

    console.log(contractFiles);
    const files = await prisma.file.findMany({
      where: { Id: { in: contractFiles } },
    });

    console.log(files);

    await res.json(files);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while generating search results.' });
  }
}
