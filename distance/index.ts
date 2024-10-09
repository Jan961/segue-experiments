import { NextApiRequest, NextApiResponse } from 'next';
import { loggingService } from 'services/loggingService';
import { DistanceStop, getDistances } from 'services/venueService';

export type DistanceParams = DistanceStop[];

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  // This takes all content from the client. No point checking

  if (req.method === 'POST') {
    try {
      const stops: DistanceParams = req.body;
      const searchResults = await getDistances(stops, req);
      res.json(searchResults);
    } catch (e) {
      console.log(e);
      await loggingService.logError(e);
      res.status(500).json({ err: 'Error getting distances' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
