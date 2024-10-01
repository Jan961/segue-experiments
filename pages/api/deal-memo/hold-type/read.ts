import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const prisma = await getPrismaClient(req);

    const holdTypes = await prisma.holdType.findMany({
      orderBy: {
        HoldTypeSeqNo: 'asc',
      },
    });

    res.status(200).json(holdTypes);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while getting data for Deal Memo' });
  }
}
