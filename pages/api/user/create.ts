import { userMapper } from 'lib/mappers';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = req.body;

    console.log(user);

    const newUser = await prisma.user.create({
      data: {
        FirstName: user.FirstName,
        LastName: user.LastName,
        Email: user.Email,
        AccountId: Number(user.AccountId),
      },
    });

    return res.json(userMapper(newUser));
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while creating the user.' });
  }
}
