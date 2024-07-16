import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';
import prisma from 'lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = await getEmailFromReq(req);
    const AccountId: number = await getAccountId(email);
    console.log(AccountId);
    const reqBody = await req.body;

    console.log(reqBody);
    //  missing fields:
    //  CompanyWebsite
    //  type of company
    //  phone number
    // one of the currency fields
    //
    const companyDetails = await prisma.Account.update({
      where: { AccountId },
      data: {
        AccountName: reqBody?.companyName,
        AccountAddress1: reqBody?.addressLine1,
        AccountAddress2: reqBody?.addressLine2,
        AccountAddress3: reqBody?.addressLine3,
        AccountAddressTown: reqBody?.townName,
        AccountAddressCountry: reqBody?.country,
        AccountAddressPostcode: reqBody?.postcode,
        AccountMainEmail: reqBody?.companyEmail,
        AccountVATNumber: reqBody?.vatNumber,
        AccountCompanyNumber: reqBody?.companyNumber,
        AccountCurrencyCode: reqBody?.currencyCode,
      },
    });
    console.log(companyDetails);
    const userDetails = await prisma.User.update({
      where: { Email: email },
      data: { FirstName: reqBody.firstName, LastName: reqBody.lastName },
    });
    console.log(userDetails);

    res.status(200).json({ status: 'Success' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error fetching Master Task' });
  }
}
