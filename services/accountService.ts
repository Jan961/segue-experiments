import prisma from 'lib/prisma';
export const createAccount = async (
  tx = prisma,
  { email, companyName, currency }: { email: string; companyName: string; currency: string },
) => {
  console.log(email, companyName, currency);
  const account = await tx.account.create({
    data: {
      AccountMainEmail: email,
      AccountName: companyName,
      AccountCurrencyCode: currency,
    },
  });
  return account;
};

export const createAccountContact = async (
  tx = prisma,
  { accountId, firstName, lastName, email }: { accountId: string; firstName: string; lastName; email: string },
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
