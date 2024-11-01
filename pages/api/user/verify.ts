import prisma from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, companyName } = req.body;

    const users = await prisma.accountUser.findMany({
      where: {
        Account: {
          AccountName: companyName,
        },
        User: {
          UserEmail: email,
        },
      },
    });

    let user = users.length > 0 ? users[0] : null;
    if (user) {
      user = { userId: user.AccUserUserId, accountUserId: user.AccUserId };
    }

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while verifying user.' });
  }
}
