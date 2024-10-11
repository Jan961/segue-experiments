import prisma from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserPermisisons } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, organisationId, pin } = req.body;
    const accountUser = await prisma.AccountUser.findFirst({
      where: {
        User: {
          UserEmail: {
            equals: email,
          },
        },
        Account: {
          AccountOrganisationId: {
            equals: organisationId,
          },
        },
        AccUserPIN: {
          equals: pin,
        },
      },
      select: {
        Account: true,
      },
    });

    const permissions = await getUserPermisisons(email, organisationId);

    return res.status(200).json({ isValid: accountUser !== null, permissions });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while validating pin' });
  }
}
