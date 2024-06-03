import { Account, AccountContact } from '@prisma/client';
import prisma from 'lib/prisma';
import { omit } from 'radash';
export const createAccount = async (account: Partial<Account>, tx = prisma) => {
  const newAccount = await tx.account.create({
    data: {
      ...omit(account, ['AccountId']),
    },
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

export const createAccountContact = async (accountContact: Partial<AccountContact>, tx = prisma) => {
  const newAccountContact = await tx.accountContact.create({
    data: {
      ...omit(accountContact, ['AccContId']),
      Account: {
        connect: {
          AccountId: accountContact.AccContAccountId,
        },
      },
    },
    include: {
      Account: true,
    },
  });
  return newAccountContact;
};

export const updateAccountContact = async (accountContact: Partial<AccountContact>, tx = prisma) => {
  const updatedAccount = await tx.accountContact.update({
    data: accountContact,
    where: {
      AccContId: accountContact.AccContId,
    },
  });
  return updatedAccount;
};
