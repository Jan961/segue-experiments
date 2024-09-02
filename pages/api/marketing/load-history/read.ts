import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { productionId } = req.body;

    const ProductionFile = await prisma.ProductionFile.findFirst({
      where: { ProFiProductionId: { equals: productionId } },
      select: {
        ProFiFileId: true,
      },
    });

    const file = await prisma.file.findFirst({
      where: { Id: { equals: ProductionFile.ProFiFileId } },
    });

    res.status(200).json({ file });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error Reading Production File' });
  }
}
