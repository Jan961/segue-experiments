import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import fuseFilter from '../../../utils/fuseFilter';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { country, town, productionId, searchQuery, limit } = req.body;
  const queryConditions: any = { IsDeleted: false };
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
    const tempVenues = venues.map((venue) => {
      return {
        ...venue,
        Town: venue.VenueAddress.find((address) => {
          return address.TypeName === 'Main';
        })?.Town,
      };
    });
    const filteredVenues = fuseFilter(tempVenues, searchQuery, ['Name', 'Code', 'Town']);
    if (filteredVenues.length > 0) {
      const returnLength = filteredVenues.length >= limit ? limit : filteredVenues.length;
      res.status(200).json(filteredVenues.slice(0, returnLength));
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch venues' });
  }
}
