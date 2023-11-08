import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const TourId: number = parseInt(req.query.tourId as string);

  const email = await getEmailFromReq(req);
  const access = await checkAccess(email, { TourId });
  if (!access) return res.status(401).end();

  try {
    await prisma.tour.update({
      where: {
        Id: TourId,
      },
      data: {
        IsDeleted: true,
      },
    });
    res.status(200).end();
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Error occurred while deleting tour.' });
  }
}
