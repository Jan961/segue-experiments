import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const prisma = await getPrismaClient(req);
    const accountId = parseInt(req.query.id as string);
    const account = await prisma.account.findUnique({
      where: {
        AccountId: accountId,
      },
    });
    return res.status(200).json(account);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while getting account id' });
  }
}
