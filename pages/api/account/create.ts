import { NextApiRequest, NextApiResponse } from 'next';
import { createAccount, createAccountContact } from 'services/accountService';
import {
  mapAccountContactFromPrismaFields,
  mapAccountFromPrismaFields,
  mapToAccountContactPrismaFields,
  mapToAccountPrismaFields,
} from './utils';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const account = req.body;
    const mappedAccount = mapToAccountPrismaFields(account);
    const newAccount = await createAccount(mappedAccount);
    const mappedAccountContact = mapToAccountContactPrismaFields({ ...account, accountId: newAccount.AccountId });
    const newAccountContact = await createAccountContact(mappedAccountContact);

    return res.status(200).json({
      ...mapAccountFromPrismaFields(newAccount),
      ...mapAccountContactFromPrismaFields(newAccountContact),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while creating new account' });
  }
}
