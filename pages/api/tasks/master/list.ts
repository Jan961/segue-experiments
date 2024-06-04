import { NextApiRequest, NextApiResponse } from 'next';
import { getMasterTasksList } from 'services/TaskService';
import { loggingService } from 'services/loggingService';
import { getAccountId, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = await getEmailFromReq(req);
    const AccountId = await getAccountId(email);
    const result = await getMasterTasksList(AccountId);
    res.status(200).json(result);
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ error: 'Error fetching Master Task' });
  }
}
