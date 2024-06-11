import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = await getEmailFromReq(req);
    const AccountId = await getAccountId(email);
    // console.log(AccountId);
    const ProdCompList = await prisma.ProductionCompany.findMany({
      where: {
        AccountId,
      },
    });
    console.log(ProdCompList);
    // get the main prod company from the Account table, get all the companies fro mthe tabel and then just select the mai none to display at the top

    return res.status(200).json(ProdCompList);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while deleting the user.' });
  }
}
