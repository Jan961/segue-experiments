import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await prisma.$queryRaw`SELECT * FROM AccountUserPermissionsView`;

    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while fetching the account user permission view.' });
  }
}
