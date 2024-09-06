import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';
import prisma from 'lib/prisma_master';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = await getEmailFromReq(req);
    const AccountId = await getAccountId(email);

    const accountLogoFile = await prisma.Account.findFirst({
      where: { AccountId: { equals: AccountId } },
      select: {
        File: true,
      },
    });

    res.status(200).json({ accountLogoFile });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error Receiving Account Logo File' });
  }
}
