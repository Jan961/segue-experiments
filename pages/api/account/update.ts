import { NextApiRequest, NextApiResponse } from 'next';

import { mapAccountFromPrismaFields, mapToAccountPrismaFields } from './utils';
import { updateAccount } from 'services/accountService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const accountDetails = req.body;
    const mappedFields = mapToAccountPrismaFields(accountDetails);
    const account = await updateAccount(mappedFields);

    return res.status(200).json(mapAccountFromPrismaFields(account));
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while updating account' });
  }
}
