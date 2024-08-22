import prisma from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';

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
    console.log('accountUser', accountUser, email, organisationId, pin);
    return res.status(200).json({ isValid: accountUser !== null });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while validating pin' });
  }
}
