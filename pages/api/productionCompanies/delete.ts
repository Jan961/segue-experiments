import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const email = await getEmailFromReq(req);
  const AccountId = await getAccountId(email);
  const { Id } = JSON.parse(req.body);
  console.log('company info var', JSON.parse(req.body));

  const deletedRecord = await prisma.ProductionCompany.delete({
    where: {
      Id,
      AccountId,
    },
  });
  console.log(deletedRecord);

  res.status(200).json(deletedRecord);
}
