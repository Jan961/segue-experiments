import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const ProductionId: number = parseInt(req.query.productionId as string);

  const email = await getEmailFromReq(req);
  const access = await checkAccess(email, { ProductionId });
  if (!access) return res.status(401).end();

  try {
    await prisma.production.update({
      where: {
        Id: ProductionId,
      },
      data: {
        IsDeleted: true,
      },
    });
    res.status(200).end();
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Error occurred while deleting production.' });
  }
}
