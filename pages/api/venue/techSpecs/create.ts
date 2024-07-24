import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body;
  const email = await getEmailFromReq(req);
  const access = await checkAccess(email, {});
  if (!access) return res.status(401).end();
  const result = await prisma.VenueFile.create({
    data: { ...data, Type: 'Tech Specs' },
  });
  res.status(200).json(result);
}
