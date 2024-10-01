import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const Id = parseInt(req.query.venueId as string);
  try {
    const prisma = await getPrismaClient(req);
    const venue = await prisma.venue.findFirst({
      where: {
        Id,
      },
      include: {
        VenueContact: {
          include: {
            VenueRole: true, // Include related VenueRole data within VenueContact
          },
        },
        VenueAddress: true, // Include related VenueContact data
      },
    });
    res.status(200).json(venue);
  } catch (e) {
    res.status(500).json({ err: e });
  }
}
