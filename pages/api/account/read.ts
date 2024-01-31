import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = await getEmailFromReq(req);
    const accountId = await getAccountId(email);
    return res.status(200).json(accountId);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while getting account id' });
  }
}
