import { UserDto } from 'interfaces';
import { userMapper } from 'lib/mappers';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = req.body as UserDto;

    const email = await getEmailFromReq(req);
    const AccountId = await getAccountId(email);

    const updatedUser = await prisma.user.update({
      data: {
        FirstName: user.FirstName,
        LastName: user.LastName,
      },
      where: {
        AccountId,
        Id: user.Id,
      },
    });

    return res.json(userMapper(updatedUser));
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while updating the user.' });
  }
}
