import prisma from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = req.query.email;
    const accounts = await prisma.AccountUser.findMany({
      where: {
        User: {
          UserEmail: {
            equals: email,
          },
        },
      },
      select: {
        Account: true,
      },
    });
    return res
      .status(200)
      .json(accounts.flatMap((a) => ({ text: a.Account.AccountName, value: a.Account.AccountOrganisationId })));
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while getting accounts' });
  }
}
