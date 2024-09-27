import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const prisma = await getPrismaClient(req);
    const Id = parseInt(req.query.venueId as string);

    const result = await prisma.venue.findFirst({
      where: { Id },
      select: {
        VenueBarredVenue_VenueBarredVenue_VBVVenueIdToVenue: {
          select: {
            BarredVenueId: true,
          },
        },
      },
    });

    const barredVenueIds = result.VenueBarredVenue_VenueBarredVenue_VBVVenueIdToVenue.map(
      (venue) => venue.BarredVenueId,
    );

    const barredVenues = await prisma.venue.findMany({
      where: {
        Id: {
          in: barredVenueIds,
        },
      },
    });

    res.status(200).json(barredVenues);
  } catch (exception) {
    console.log(exception);
    res.status(400).json('Failed to get files.');
  }
}
