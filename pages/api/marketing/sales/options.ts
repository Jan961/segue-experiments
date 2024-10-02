import { NextApiRequest, NextApiResponse } from 'next';
import { getSaleTypeOptions } from 'services/salesService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const options = await getSaleTypeOptions(req);
    res.status(200).json({ ...options });
  } catch (err) {
    console.log('error', err);
    res.status(500).json({ err: err?.message || 'Error updating AvailableComp' });
  }
}
