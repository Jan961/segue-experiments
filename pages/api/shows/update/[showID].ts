import { ShowDTO } from 'interfaces';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { omit } from 'radash';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const show = req.body as ShowDTO;

  try {
    const prisma = await getPrismaClient(req);
    const updatedShow = await prisma.show.update({
      where: {
        Id: show.Id,
      },
      data: omit(show, ['Id']),
    });
    res.status(200).json(updatedShow);
  } catch (e) {
    console.log(e);
    res.status(500).json({});
  }
}
