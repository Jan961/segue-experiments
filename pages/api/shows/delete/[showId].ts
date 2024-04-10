import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const ShowId: number = parseInt(req.query.showId as string);

  const email = await getEmailFromReq(req);
  const access = await checkAccess(email, { ShowId });
  if (!access) return res.status(401).end();

  try {
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
