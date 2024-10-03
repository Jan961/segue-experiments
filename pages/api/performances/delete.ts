import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';
import { PerformanceDTO } from 'interfaces';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const perf = req.body as PerformanceDTO;
    const prisma = await getPrismaClient(req);

    await prisma.$transaction([
      prisma.performance.delete({
        where: {
          Id: perf.Id,
        },
      }),
    ]);
    console.log(`Deleted Performance: ${perf.Id}`);
    res.status(200).json({});
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Error Deleting Performance' });
  }
}
