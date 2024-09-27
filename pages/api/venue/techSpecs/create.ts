import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = req.body;
    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, {});
    if (!access) return res.status(401).end();
    const result = await prisma.VenueFile.create({
      data: { ...data, Type: 'Tech Specs' },
    });
    res.status(200).json(result);
  } catch (exception) {
    console.log(exception);
    res.status(400).json('Failed to upload file.');
  }
}
