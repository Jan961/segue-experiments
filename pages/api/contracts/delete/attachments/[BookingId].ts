import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId = parseInt(req.query.BookingId as string);

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId });
    if (!access) return res.status(401).end();

    const data = req.body;
    console.log(data);

    const result = await prisma.ContractFile.findFirst({
      where: {
        FileId: data.FileId,
      },
      select: {
        Id: true,
      },
    });

    await prisma.ContractFile.delete({
      where: {
        Id: result.Id,
      },
    });

    res.status(200).json({ status: 'Success' });
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while deleting Contract File' });
  }
}
