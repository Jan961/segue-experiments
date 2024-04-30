import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { country, town, productionId, searchQuery, limit } = req.body;
  const queryConditions: any = { IsDeleted: false };
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
        CountryId: country,
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
      ...(limit && { take: limit }),
      where: queryConditions,
      include: {
        VenueAddress: true,
        VenueContact: {
          include: {
            VenueRole: true,
          },
        },
        VenueBarredVenue_VenueBarredVenue_VBVVenueIdToVenue: true,
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
