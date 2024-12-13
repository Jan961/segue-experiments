import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { setId, dataToUpd } = req.body;

    const prisma = await getPrismaClient(req);
    const updatedSaleSet = await prisma.salesSet.update({
      where: {
        SetId: setId,
      },
      data: dataToUpd,
    });

    res.status(200).json({ ok: true, updatedSaleSet });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err, ok: false });
  }
}
