import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const email = await getEmailFromReq(req);
  const AccountId = await getAccountId(email);
  const { Name, WebSite } = JSON.parse(req.body);
  console.log('company info var', JSON.parse(req.body));

  const newProdCompany = await prisma.ProductionCompany.create({
    data: {
      AccountId,
      WebSite,
      Name,
    },
  });
  console.log(newProdCompany);

  res.status(200).json(newProdCompany);
}
