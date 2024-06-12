import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = await getEmailFromReq(req);
    const AccountId = await getAccountId(email);
    const productionCompanyList = await prisma.ProductionCompany.findMany({
      where: {
        AccountId,
      },
      select: {
        Id: true,
        Name: true,
        WebSite: true,
        Logo: true,
      },
    });
    console.log('prod co list', productionCompanyList);
    const prodCoIdList = productionCompanyList.map((item) => item.Id);
    console.log(prodCoIdList);
    const prodCompanyWithShows = await prisma.Show.findMany({
      where: { ShowProdCoId: { in: prodCoIdList } },
    });
    console.log(prodCompanyWithShows);

    // find the production companies and if they have ties to productions
    // make upsert
    // make delete
    // make logo and integrate with Aruns stuff
    console.log(productionCompanyList);
    return res.status(200).json(productionCompanyList);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while deleting the user.' });
  }
}
