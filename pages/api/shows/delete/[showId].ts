import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const ShowId: number = parseInt(req.query.showId as string);

  try {
    const prisma = await getPrismaClient(req);
    await prisma.show.delete({
      where: {
        Id: ShowId,
      },
    });
    res.status(200).end();
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Error occurred while deleting show' });
  }
}
