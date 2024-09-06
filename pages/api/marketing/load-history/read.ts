import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const selectedId = Array.isArray(req.query.selected)
      ? parseInt(req.query.selected[0])
      : parseInt(req.query.selected);

    const ProductionFile = await prisma.ProductionFile.findFirst({
      where: { ProFiProductionId: { equals: selectedId } },
      select: {
        File: true,
        ProFiId: true,
      },
    });

    res.status(200).json({ ProductionFile });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error Reading Production File' });
  }
}
