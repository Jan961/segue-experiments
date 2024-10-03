import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const VenueId: number = parseInt(req.query.venueID as string);
  try {
    const prisma = await getPrismaClient(req);
    await prisma.venue.update({
      where: {
        Id: VenueId,
      },
      data: {
        BarringClause: req.body.BarringClause,
        BarringWeeksPre: parseInt(req.body.BarringWeeksPre),
        BarringWeeksPost: parseInt(req.body.BarringWeeksPost),
        BarringMiles: parseInt(req.body.BarringMiles),
      },
    });
    res.status(200).end();
  } catch (e) {
    res.status(501).end();
  }
  return res;
}
