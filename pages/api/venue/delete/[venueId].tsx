import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const Id: number = parseInt(req.query.venueId as string, 10);
  try {
    const prisma = await getPrismaClient(req);
    await prisma.venue.update({
      where: {
        Id,
      },
      data: {
        IsDeleted: true,
      },
    });
    res.status(200).json({ ok: true });
  } catch (e) {
    console.log(e);
    res.status(500).json({ ok: false });
  }
}
