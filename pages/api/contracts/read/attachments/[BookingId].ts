import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId = parseInt(req.query.BookingId as string);
    const prisma = await getPrismaClient(req);

    const contractFiles = (
      await prisma.contractFile.findMany({
        where: {
          ContractBookingId: BookingId,
        },
        select: { FileId: true },
      })
    ).map((file) => file.FileId);

    const files = await prisma.file.findMany({
      where: { Id: { in: contractFiles } },
    });

    await res.json(files);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while generating search results.' });
  }
}
