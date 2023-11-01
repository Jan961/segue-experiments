import { VenueVenue } from '@prisma/client';
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

    return {
      Date: stop.Date,
      option: stop.Ids.map((id: number) => {
        // Get any distances that match (optimisation possible)
        const match = distances.filter(
          (x: VenueVenue) =>
            (x.Venue2Id === id && x.Venue1Id === prev.Ids[0]) || (x.Venue1Id === id && x.Venue2Id === prev.Ids[0]),
        )[0];
        prev = stop;

        return {
          VenueId: id,
          Miles: match?.Mileage ? match.Mileage : null,
          Mins: match?.TimeMins ? match.TimeMins : null,
        };
      }),
    };
  });
};
