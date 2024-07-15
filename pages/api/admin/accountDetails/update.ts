import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';
import prisma from '../../../../lib/prisma';
import { getAllCurrencyList } from '../../../../services/currencyService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = await getEmailFromReq(req);
    const AccountId = await getAccountId(email);

    const companyDetails = await prisma.Account.findFirst({
      where: { AccountId: { equals: AccountId } },
    });
    const userDetails = await prisma.User.findFirst({
      where: { Email: { equals: email } },
    });

    console.log(userDetails);

    const completeCompanyDetails = { ...companyDetails, ...userDetails };

    const countryList = await prisma.Country.findMany({ select: { Id: true, Name: true } });

    const currencyList = await getAllCurrencyList();

    res.status(200).json({ companyDetails: completeCompanyDetails, countryList, currencyList });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error fetching Master Task' });
  }
}
