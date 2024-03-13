import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { country, town, productionId } = req.body;
  const queryConditions: any = {};
  if (country) {
    queryConditions.VenueAddress = {
      some: {
        Country: country,
      },
    };
  }
  if (town) {
    queryConditions.VenueAddress = {
      ...(queryConditions.VenueAddress || {}),
      some: {
        ...((queryConditions.VenueAddress || {}).some || {}),
        Town: town,
      },
    };
  }
  if (productionId) {
    queryConditions.Booking = {
      some: {
        DateBlock: {
          ProductionId: parseInt(productionId),
        },
      },
    };
  }

  try {
    const venues = await prisma.venue.findMany({
      where: queryConditions,
      include: {
        VenueAddress: true, // Adjust according to your needs
        Booking: {
          include: {
            DateBlock: true, // Adjust according to your needs
          },
        },
      },
    });
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch venues' });
  }
}
