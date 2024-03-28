import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { country, town, productionId, searchQuery } = req.body;
  const queryConditions: any = {};
  if (searchQuery) {
    queryConditions.OR = [
      {
        Name: {
          contains: searchQuery,
        },
      },
      {
        Code: {
          contains: searchQuery,
        },
      },
      {
        VenueAddress: {
          some: {
            Town: {
              contains: searchQuery,
            },
          },
        },
      },
    ];
  }
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
        VenueAddress: true,
        Booking: {
          include: {
            DateBlock: true,
          },
        },
      },
      orderBy: [
        {
          Code: 'asc',
        },
      ],
    });
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch venues' });
  }
}
