import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const prisma = await getPrismaClient(req);
    const data = req.body;

    const result = await prisma.contractFile.findFirst({
      where: {
        FileId: data.FileId,
      },
      select: {
        Id: true,
      },
    });

    await prisma.contractFile.delete({
      where: {
        Id: result.Id,
      },
    });

    res.status(200).json({ status: 'Success' });
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while deleting Contract File' });
  }
}
