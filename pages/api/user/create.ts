import { userMapper } from 'lib/mappers';
import prisma from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = req.body;
    const newUser = await prisma.user.create({
      data: {
        UserFirstName: user.firstName,
        UserLastName: user.lastName,
        UserEmail: user.email,
        AccountUser: {
          create: {
            AccUserIsAdmin: true,
            AccUserPIN: user.pin,
            Account: {
              connect: {
                AccountId: Number(user.accountId),
              },
            },
          },
        },
      },
      include: {
        AccountUser: true,
      },
    });

    return res.json(userMapper(newUser));
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while creating the user.' });
  }
}
