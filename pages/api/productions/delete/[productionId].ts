import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const ProductionId: number = parseInt(req.query.productionId as string);

  const prisma = await getPrismaClient(req);

  try {
    await prisma.production.delete({
      where: {
        Id: ProductionId,
      },
    });
    res.status(200).json({ message: 'Production deleted successfully', ok: true });
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Error occurred while deleting production.' });
  }
}
