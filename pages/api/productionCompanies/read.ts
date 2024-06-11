import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = await getEmailFromReq(req);
    const AccountId = await getAccountId(email);
    // const UserList = await prisma.User.findMany({
    //   where: {
    //     AccountId,
    //   },
    // });

    const productionCompanyList = await prisma.ProductionCompany.findMany({
      where: {
        AccountId,
      },
      select: {
        Name: true,
        WebSite: true,
        Logo: true,
      },
    });

    return res.status(200).json(productionCompanyList);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while deleting the user.' });
  }
}
