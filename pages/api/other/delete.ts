import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';
import { OtherDTO } from 'interfaces';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const other = req.body as OtherDTO;
    const prisma = await getPrismaClient(req);

    await prisma.$transaction([
      prisma.other.delete({
        where: {
          Id: other.Id,
        },
      }),
    ]);
    console.log(`Deleted Other: ${other.Id}`);
    return res.status(200).json({});
  } catch (e) {
    console.log(e);
    return res.status(500).json({ err: 'Error Deleting Other' });
  }
}
