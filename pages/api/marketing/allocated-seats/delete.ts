import { loggingService } from 'services/loggingService';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { CompAllocation } from 'prisma/generated/prisma-client';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = req.body as CompAllocation;
    const prisma = await getPrismaClient(req);

    const response = await prisma.compAllocation.delete({
      where: {
        Id: data.Id,
      },
    });

    res.status(200).json({ id: response.Id });
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error deleting CompAllocation' });
  }
}
