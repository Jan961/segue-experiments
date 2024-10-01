import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const prisma = await getPrismaClient(req);

    const result = await prisma.performanceReport.findMany({});
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Error fetching reports' });
  }
}
