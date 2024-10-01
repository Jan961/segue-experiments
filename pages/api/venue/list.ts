import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import fuseFilter from 'utils/fuseFilter';
import { getFileCardFromFileId } from 'services/fileService';
import { omit } from 'radash';

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
    const prisma = await getPrismaClient(req);
    const venues = await prisma.venue.findMany({
      where: queryConditions,
      include: {
        VenueAddress: true,
        VenueFile: true,
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
    let filteredVenues = fuseFilter(tempVenues, searchQuery, ['Name', 'Code', 'Town']);

    if (filteredVenues.length > 0) {
      const returnLength = limit && filteredVenues.length >= limit ? limit : filteredVenues.length;
      filteredVenues = await Promise.all(
        filteredVenues.slice(0, returnLength).map(async (venue) => {
          const files = await Promise.all(
            venue.VenueFile.map(async (file) => {
              return await getFileCardFromFileId(file.FileId, req);
            }),
          );
          venue = omit(venue, ['VenueFile']);
          return {
            ...venue,
            Files: files,
          };
        }),
      );
      res.status(200).json(filteredVenues);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch venues' });
  }
}
