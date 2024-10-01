import prisma from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = await getEmailFromReq(req);
    const AccountId = await getAccountId(email);
    const UserList = await prisma.User.findMany({
      where: {
        AccountId,
      },
    });
    return res.status(200).json(UserList);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while deleting the user.' });
  }
}
