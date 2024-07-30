import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';
import prisma from 'lib/prisma';
import schema from 'components/admin/tabs/AccountDetailsValidationSchema';
import { UiAccountType } from 'config/account';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = await getEmailFromReq(req);
    const AccountId: number = await getAccountId(email);
    const reqBody = req.body;

    if (!(await validateInfo(reqBody))) res.status(500).json({ error: 'Error Updating Account Information' });

    await prisma.Account.update({
      where: { AccountId },
      data: {
        AccountName: reqBody?.companyName,
        AccountAddress1: reqBody?.addressLine1,
        AccountAddress2: reqBody?.addressLine2,
        AccountAddress3: reqBody?.addressLine3,
        AccountAddressTown: reqBody?.townName,
        AccountAddressCountry: reqBody?.country,
        AccountAddressPostcode: reqBody?.postcode,
        AccountPhone: reqBody?.phoneNumber,
        AccountMainEmail: reqBody?.companyEmail,
        AccountWebsite: reqBody?.companyWebsite,
        AccountVATNumber: reqBody?.vatNumber,
        AccountCompanyNumber: reqBody?.companyNumber,
        AccountCurrencyCode: reqBody?.currency,
        AccountTypeOfCompany: reqBody?.typeOfCompany,
        AccountPaymentCurrencyCode: reqBody?.currencyForPayment,
      },
    });

    const result = await prisma.AccountContact.findFirst({
      where: { AccContAccountId: AccountId },
      select: { AccContId: true },
    });

    await prisma.AccountContact.update({
      where: { AccContId: result.AccContId },
      data: { AccContFirstName: reqBody?.firstName, AccContLastName: reqBody?.lastName },
    });

    res.status(200).json({ status: 'Success' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error Updating Account Information' });
  }
}

async function validateInfo(data: UiAccountType) {
  try {
    await schema.validate({ ...data }, { abortEarly: false });
    return true;
  } catch (validationErrors) {
    const errors = {};
    validationErrors.inner.forEach((error) => {
      errors[error.path] = error.message;
    });
    return false;
  }
}
