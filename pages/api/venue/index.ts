import { NextApiRequest, NextApiResponse } from 'next';
import { getAllVenues } from 'services/venueService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const result = await getAllVenues();
  res.json(result);
}
