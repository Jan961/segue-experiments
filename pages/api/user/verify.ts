import prisma from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';
import { isNullOrEmpty } from 'utils';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, companyName } = req.body;

    const users = await prisma.accountUser.findMany({
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
    if (!isNullOrEmpty(users)) {
      const userWithSameAccount = users.find((u) => u.Account.AccountName === companyName);
      // A user exists for the same company/account or a different company/account
      accountUser = {
        firstName: users[0].User.UserFirstName,
        lastName: users[0].User.UserLastName,
        accountUserExists: !!userWithSameAccount,
      };
    }

    return res.status(200).json(accountUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while verifying user.' });
  }
}
