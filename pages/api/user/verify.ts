import prisma from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, companyName } = req.body;

    const user = await prisma.accountUser.findFirst({
      where: {
        User: {
          UserEmail: email,
        },
      },
      select: {
        User: true,
        Account: true,
      },
    });

    let accountUser = { firstName: '', lastName: '', accountUserExists: false };
    if (user) {
      accountUser = {
        firstName: user.User.UserFirstName,
        lastName: user.User.UserLastName,
        accountUserExists: user.Account.AccountName === companyName,
      };
    }

    return res.status(200).json(accountUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while verifying user.' });
  }
}
