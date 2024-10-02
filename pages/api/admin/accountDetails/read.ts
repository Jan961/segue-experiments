import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';
import prismaMaster from 'lib/prisma_master';
import getPrismaClient from 'lib/prisma';
import { getAllCurrencyList } from 'services/globalService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = await getEmailFromReq(req);
    const AccountId = await getAccountId(email);
    const prismaClient = await getPrismaClient(req);
    const companyDetails = await prismaMaster.Account.findFirst({
      where: { AccountId: { equals: AccountId } },
      include: {
        AccountContact: true,
      },
    });

    const countryList = await prismaClient.country.findMany({ select: { Id: true, Name: true } });

    const currencyList = await getAllCurrencyList();

    res.status(200).json({ companyDetails, countryList, currencyList });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error Updating Account Information' });
  }
}
