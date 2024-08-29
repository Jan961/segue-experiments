import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';
import prisma from 'lib/prisma_master';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = await getEmailFromReq(req);
    const AccountId: number = await getAccountId(email);
    const reqBody = req.body;

    await prisma.Account.update({
      where: { AccountId },
      data: {
        AccountLogoFileId: reqBody?.fileId,
      },
    });

    res.status(200).json({ status: 'Success' });
  } catch (err) {
    res.status(500).json({ error: 'Error Updating Account Logo' });
  }
}
