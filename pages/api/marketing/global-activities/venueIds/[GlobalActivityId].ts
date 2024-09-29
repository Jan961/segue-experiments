import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = parseInt(req.query.GlobalActivityId as string);
    const prisma = await getPrismaClient(req);

    const venueIds = await prisma.globalBookingActivityVenue.findMany({
      select: {
        VenueId: true,
      },
      where: {
        GlobalActivityId: id,
      },
    });

    res.json(venueIds);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while querying for Global Activities by VenueId.' });
  }
}
