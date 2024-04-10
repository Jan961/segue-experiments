import { Venue, VenueVenue } from '@prisma/client';
import prisma from 'lib/prisma';

export const getAllVenuesMin = async () => {
  return prisma.venue.findMany({
    where: {
      IsDeleted: false,
    },
    select: {
      Id: true,
      Name: true,
      Code: true,
      Seats: true,
      VenueAddress: {
        select: {
          Town: true,
          TypeName: true,
        },
      },
    },
  });
};

export const getAllVenues = async () => {
  return prisma.venue.findMany({
    where: {
      IsDeleted: false,
    },
    // select: {
    //   VenueAddress: {
    //     Town: true,
    //   },
    // },
  });
};

export const getUniqueVenueTownlist = async () => {
  return await prisma.venueAddress.groupBy({
    by: ['Town'],
    where: {
      Town: {
        not: null,
      },
    },
  });
};

export const getUniqueVenueCountrylist = async () => {
  return await prisma.venueAddress.groupBy({
    by: ['Country'],
    where: {
      Country: {
        not: null,
      },
    },
  });
};

export interface DistanceStop {
  Date: string;
  Ids: number[];
}

interface DistanceDTO {
  VenueId: number;
  Mins?: number;
  Miles?: number;
}

export interface DateDistancesDTO {
  Date: string;
  option: DistanceDTO[];
}

// If slow. Optimisation possible (Hash lookup)
export const getDistances = async (stops: DistanceStop[]): Promise<DateDistancesDTO[]> => {
  const ids = stops.map((x) => x.Ids).flat();

  // Get the distances for all possible combinations (optimisation possible)
  const distances = await prisma.venueVenue.findMany({
    where: {
      Venue1Id: {
        in: ids,
      }, // And
      Venue2Id: {
        in: ids,
      },
    },
  });

  // Hold the previous stop for distance lookup
  let prev = null;

  return stops.reverse().map((stop: DistanceStop) => {
    if (!prev || prev.Ids.length > 1) {
      // If the last stop has multiple options, we don't know which
      prev = stop;
      return { Date: stop.Date, option: stop.Ids.map((id) => ({ VenueId: id, Miles: null, Mins: null })) };
    }
    const prevIdsAsString = prev.Ids.join(',');
    return {
      Date: stop.Date,
      option: stop.Ids.map((id: number) => {
        // Get any distances that match (optimisation possible)
        const match = distances.filter(
          (x: VenueVenue) =>
            (x.Venue2Id === id && x.Venue1Id === prev.Ids[0]) || (x.Venue1Id === id && x.Venue2Id === prev.Ids[0]),
        )[0];
        prev = stop;

        return prevIdsAsString === stop.Ids.join(',')
          ? {
              VenueId: id,
              Miles: match?.Mileage,
              Mins: match?.TimeMins,
            }
          : {
              VenueId: id,
              Miles: match?.Mileage ? match.Mileage : -1,
              Mins: match?.TimeMins ? match.TimeMins : -1,
            };
      }),
    };
  });
};

export const getDistance = async (stop: DistanceStop): Promise<DateDistancesDTO> => {
  const [id1, id2] = stop.Ids;

  if (!id1 || !id2 || id1 === id2) {
    return { Date: stop.Date, option: [{ VenueId: id1, Mins: null, Miles: null }] };
  }
  // Get the distances for all possible combinations (optimisation possible)
  const distance = await prisma.venueVenue.findMany({
    where: {
      Venue1Id: id1, // And
      Venue2Id: id2,
    },
  });

  const { Venue1Id, TimeMins, Mileage } = distance[0];
  return { Date: stop.Date, option: [{ VenueId: Venue1Id, Mins: TimeMins, Miles: Mileage }] };
};

export const getAllVenueFamilyList = () => {
  return prisma.VenueFamily.findMany({
    orderBy: {
      Name: 'asc',
    },
  });
};

export const createVenue = async (venue: Partial<Venue>) => {
  return prisma.venue.create({
    data: venue,
  });
};
