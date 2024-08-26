import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma_master';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { organisationId } = req.body;
    const accounts = await prisma.account.findMany({
      where: {
        AccountOrganisationId: organisationId,
      },
    });

    const userAccount =
      accounts?.length > 0
        ? {
            id: accounts[0].AccountId,
            companyName: accounts[0].AccountName,
          }
        : {
            id: null,
            companyName: '',
          };

    return res.status(200).json(userAccount);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while validating account' });
  }
}
