import prisma from 'lib/prisma';
export const createAccount = async (
  {
    email,
    companyName,
    currency,
    addressLine1,
    addressLine2,
    addressLine3,
    town,
    county,
    postcode,
    country,
  }: {
    email: string;
    companyName: string;
    currency: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    town: string;
    county: string;
    postcode: string;
    country: string;
  },
  tx = prisma,
) => {
  console.log(email, companyName, currency);
  const account = await tx.account.create({
    data: {
      AccountMainEmail: email,
      AccountName: companyName,
      AccountCurrencyCode: currency,
      AccountAddress1: addressLine1,
      AccountAddress2: addressLine2,
      AccountAddress3: addressLine3,
      AccountAddressTown: town,
      AccountAddressCounty: county,
      AccountAddressPostcode: postcode,
      AccountAddressCountry: country,
    },
  });
  return account;
};

export const createAccountContact = async (
  { accountId, firstName, lastName, email }: { accountId: string; firstName: string; lastName; email: string },
  tx = prisma,
) => {
  const accountContact = await tx.accountContact.create({
    data: {
      AccContFirstName: firstName,
      AccContLastName: lastName,
      AccContMainEmail: email,
      AccContAccountId: accountId,
      Account: { connect: { AccountId: accountId } },
    },
    include: {
      Account: true,
    },
  });
  return accountContact;
};
