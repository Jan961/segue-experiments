import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma_master';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { companyName, email } = req.body;
    const accounts = await prisma.account.findMany({
      where: {
        AccountName: companyName,
        AccountMainEmail: email,
      },
    });

    return res.status(200).json({ accountExists: accounts?.length === 1 });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while validating account' });
  }
}
