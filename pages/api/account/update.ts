import { NextApiRequest, NextApiResponse } from 'next';

import {
  mapAccountFromPrismaFields,
  mapToAccountPrismaFields,
  mapToAccountContactPrismaFields,
  mapAccountContactFromPrismaFields,
} from './utils';
import { updateAccount, updateAccountContact } from 'services/accountService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const account = req.body;
    const mappedAccount = mapToAccountPrismaFields(account);
    const newAccount = await updateAccount(mappedAccount);
    const mappedAccountContact = mapToAccountContactPrismaFields({ ...account, accountId: newAccount.AccountId });
    const newAccountContact = await updateAccountContact(mappedAccountContact);

    return res.status(200).json({
      ...mapAccountFromPrismaFields(newAccount),
      ...mapAccountContactFromPrismaFields(newAccountContact),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while updating account' });
  }
}
