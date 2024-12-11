import prisma from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';

import { getUserPermisisons } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, organisationId, pin } = req.body;
    const accountUser = await prisma.AccountUser.findFirst({
      where: {
        AccUserIsActive: true,
        User: {
          UserEmail: email,
          UserIsActive: true,
        },
        Account: {
          AccountPIN: pin,
          AccountOrganisationId: organisationId,
        },
      },
      select: {
        Account: true,
      },
    });

    if (!accountUser) {
      return res.status(200).json({ isValid: false, permissions: [] });
    }

    const { AccountOrganisationId } = accountUser.Account;

    const permissions = await getUserPermisisons(email, AccountOrganisationId);

    return res.status(200).json({ isValid: AccountOrganisationId !== null, permissions });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while validating pin' });
  }
}
