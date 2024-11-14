import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';
import { GapSuggestionUnbalancedProps } from 'services/booking/gapSuggestion/types';
import { calculateGapSuggestions } from 'services/booking/gapSuggestion';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const prisma = await getPrismaClient(req);
    const params = req.body as GapSuggestionUnbalancedProps;

    const result = await calculateGapSuggestions(prisma, params);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: 'Error calculating gap suggestion' });
  }
}
