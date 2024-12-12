import { Account, AccountContact } from 'prisma/generated/prisma-master';
import prisma from 'lib/prisma_master';
import { omit } from 'radash';
export const createAccount = async (account: Partial<Account>, tx = prisma) => {
  const newAccount = await tx.account.create({
    data: {
      ...omit(account, ['AccountId']),
    },
  });
  return newAccount;
};

export const createDefaultProductionCompany = async (accountId: number, companyName: string, tx = prisma) => {
  const newAccount = await tx.productionCompany.create({
    data: {
      ProdCoAccountId: accountId,
      ProdCoName: companyName,
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
      ...omit(accountContact, ['AccContId', 'AccContAccountId']),
      Account: {
        connect: {
          AccountId: accountContact.AccContAccountId,
        },
      },
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

export const getAccountPIN = async (accountId: number) => {
  const account = await prisma.account.findUnique({
    where: {
      AccountId: accountId,
    },
    select: {
      AccountPIN: true,
    },
  });
  return account.AccountPIN;
};

export const getAccountByName = async (name: string) => {
  const account = await prisma.account.findFirst({
    where: {
      AccountName: name,
    },
  });
  return account;
};
