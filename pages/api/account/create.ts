import { NextApiRequest, NextApiResponse } from 'next';
import { createAccount } from 'services/accountService';
import { mapAccountFromPrismaFields, mapToAccountContactPrismaFields, mapToAccountPrismaFields } from './utils';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const account = req.body;
    const mappedAccount = mapToAccountPrismaFields(account);
    const mappedAccountContact = mapToAccountContactPrismaFields(account);
    const newAccount = await createAccount(mappedAccount, mappedAccountContact);

    return res.status(200).json(mapAccountFromPrismaFields(newAccount));
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while creating new account' });
  }
}
