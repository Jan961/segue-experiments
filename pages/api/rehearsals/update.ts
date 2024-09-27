import { RehearsalDTO } from 'interfaces';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const rehearsal = req.body as RehearsalDTO;

  const email = await getEmailFromReq(req);
  const access = await checkAccess(email, { RehearsalId: rehearsal.Id });
  if (!access) return res.status(401).end();

  try {
    const results = await prisma.rehearsal.update({
      where: {
        Id: rehearsal.Id,
      },
      data: rehearsal,
    });
    res.status(200).json(results);
  } catch (e) {
    console.log(e);
    res.status(500);
  }
}
