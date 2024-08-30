import master from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId: number = parseInt(req.query.BookingId as string);
    const userId: number = parseInt(req.query.userId as string);
    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId });
    if (!access) return res.status(401).end();
    const getDealMemo = await master.user.findUnique({
      where: {
        UserId: userId,
      },
      include: {
        AccountUser: {
          include: {
            Account: {
              include: {
                AccountContact: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json(getDealMemo);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while getting data for contacts' });
  }
}
