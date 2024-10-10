import { loggingService } from 'services/loggingService';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { BookingFile } from 'prisma/generated/prisma-client';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = req.body as BookingFile;
    const prisma = await getPrismaClient(req);

    const result = await prisma.bookingFile.create({
      data,
    });
    res.status(200).json(result);
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error creating BookingFile' });
  }
}
