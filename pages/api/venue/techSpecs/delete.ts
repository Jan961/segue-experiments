import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { fileId } = req.body;
    const email = await getEmailFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();
    await prisma.File.delete({
      where: { Id: fileId },
    });
    await prisma.VenueFile.delete({
      where: { FileId: fileId },
    });
    res.status(200).json({});
  } catch (exception) {
    console.log(exception);
  }
}
