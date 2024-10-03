import { NextApiRequest, NextApiResponse } from 'next';
import { getMasterTasksList } from 'services/TaskService';
import { loggingService } from 'services/loggingService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await getMasterTasksList(req);

    res.status(200).json(result);
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ error: 'Error fetching Master Task' });
  }
}
