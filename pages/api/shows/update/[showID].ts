import { ShowDTO } from 'interfaces';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { omit } from 'radash';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const show = req.body as ShowDTO;

  const email = await getEmailFromReq(req);
  const access = await checkAccess(email, { ShowId: show.Id });
  if (!access) return res.status(401).end();

  try {
    await prisma.show.update({
      where: {
        Id: show.Id,
      },
      data: omit(show, ['Id']),
    });
    res.status(200).end();
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
  return res;
}
