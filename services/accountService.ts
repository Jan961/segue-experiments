import { Account } from '@prisma/client';
import prisma from 'lib/prisma';
import { omit } from 'radash';
export const createAccount = async (account: Partial<Account>, tx = prisma) => {
  const newAccount = await tx.account.create({
    data: omit(account, ['AccountId']),
  });
  return newAccount;
};

export const updateAccount = async (account: Partial<Account>, tx = prisma) => {
  const updatedAccount = await tx.account.update({
    data: account,
    where: {
      AccountId: account.AccountId,
    },
  });
  return updatedAccount;
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
