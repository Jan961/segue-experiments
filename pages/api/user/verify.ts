import prisma from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { Email, organisationId } = req.body;

    const users = await prisma.accountUser.findMany({
      where: {
        Account: {
          AccountOrganisationId: organisationId,
        },
        User: {
          UserEmail: Email,
        },
      },
    });
    console.log('users', users);
    return res.status(200).json({ id: users.length > 0 ? users[0].Id : null });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred whileverifying pin.' });
  }
}
