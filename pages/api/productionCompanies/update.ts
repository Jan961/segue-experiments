import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const email = await getEmailFromReq(req);
  const AccountId = await getAccountId(email);
  const { Name, WebSite, Id } = JSON.parse(req.body);
  console.log('company info var', JSON.parse(req.body));

  const editted = await prisma.ProductionCompany.update({
    data: {
      WebSite,
      Name,
    },
    where: {
      Id,
      AccountId,
    },
  });
  console.log(editted);

  res.status(200).json(editted);
}
