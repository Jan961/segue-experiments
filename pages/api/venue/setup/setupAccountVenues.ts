import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { omit } from 'radash';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!req.body.accountId) {
      return res.status(400).json({ error: 'AccountId is required.' });
    }

    const masterVenues = await prisma.masterVenue.findMany({
      where: {
        deleted: 0,
      },
    });

    const newVenues = masterVenues.map((venue) => {
      const clone = omit(venue, ['VenueId']);
      return {
        ...clone,
        MasterVenueId: venue.VenueId,
        AccountId: parseInt(req.body.accountId),
      };
    });

    // inserts all the mapped venues in bulk
    const copiedVenues = await prisma.$transaction(
      newVenues.map((newVenue) => prisma.venue.create({ data: newVenue })),
    );

    // need to change response for security reasons
    res.status(200).json({
      message: `Successfully copied ${copiedVenues.length} rows from MasterVenue to Venue`,
      count: copiedVenues.length,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
}
