import { UserDto } from 'interfaces';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = req.body as UserDto;

    const email = await getEmailFromReq(req);
    const AccountId = await getAccountId(email);

    await prisma.user.delete({
      where: {
        AccountId,
        Id: user.Id,
      },
    });

    return res.end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while deleting the user.' });
  }
}
