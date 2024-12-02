import { UTCDate } from '@date-fns/utc';
import getPrismaClient from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { checkDateOverlap, newDate } from 'services/dateService';
import { getDateFromWeekNumber } from 'utils/barring';

export type BarredVenue = {
  id: number;
  name: string;
  code: string;
  mileage: number;
  date: string;
  hasBarringConflict: boolean;
  bookingId: number;
  timeMins: number;
  info: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    productionId: ProductionId,
    venueId: VenueId,
    startDate,
    endDate,
    includeExcluded,
    barDistance: Miles,
    seats: Seats,
    filterBarredVenues = false,
  } = req.body;

  if (!ProductionId || !VenueId) {
    return res.status(400).json({ message: 'ProductionId and VenueId are required.' });
  }
  try {
    const prisma = await getPrismaClient(req);
    const givenStartDate = newDate(startDate);
    const givenEndDate = newDate(endDate);

    // Get user venue info
    const uv = await prisma.venue.findUnique({
      where: { Id: VenueId },
    });

    const {
      BarringWeeksPost: uvBarringWeeksPost,
      BarringWeeksPre: uvBarringWeeksPre,
      BarringMiles: uvBarringMiles,
    } = uv;

    // Get all venues within the production and their bookings
    const bookingsWithVenues = await prisma.booking.findMany({
      where: {
        DateBlock: { ProductionId },
        Venue: {
          is: {
            ...(!includeExcluded && {
              ExcludeFromChecks: false,
            }),
            ...(Seats && {
              Seats: {
                gte: Seats,
              },
            }),
          },
        },
      },
      include: {
        Venue: true,
      },
    });

    // Get all venue IDs from bookings
    const venueIds = bookingsWithVenues.map((booking) => booking.Venue.Id);

    // Fetch travel info for all relevant venues
    const travelInfo = await prisma.venueVenueTravelView.findMany({
      where: {
        OR: [
          {
            Venue1Id: VenueId,
            Venue2Id: { in: venueIds },
          },
          {
            Venue2Id: VenueId,
            Venue1Id: { in: venueIds },
          },
        ],
      },
    });

    // Create a map for quick travel info lookup
    const travelInfoMap = new Map();
    travelInfo.forEach((info) => {
      const otherVenueId = info.Venue1Id === VenueId ? info.Venue2Id : info.Venue1Id;
      if (info.Mileage || info.TimeMins) {
        travelInfoMap.set(otherVenueId, {
          mileage: info.Mileage,
          timeMins: info.TimeMins,
        });
      }
    });

    let results: BarredVenue[] = [];
    for (const { Venue: bv, FirstDate, Id } of bookingsWithVenues) {
      let info = '';
      let isBarred = false;

      const venueVenueInfo = travelInfoMap.get(bv.Id);
      const distance = venueVenueInfo?.mileage;

      if (bv.Id === VenueId || !distance) continue;

      const {
        BarringWeeksPost: bvBarringWeeksPost,
        BarringWeeksPre: bvBarringWeeksPre,
        BarringMiles: bvBarringMiles,
      } = bv;

      // Determine if within barring distance
      const mileageCheck = distance !== null && distance <= Miles;
      if (mileageCheck) {
        isBarred = true;
        info = info + `${uv.Name} is within ${Miles} miles of ${bv.Name} `;
      }

      const bvBarringStartDate = getDateFromWeekNumber(FirstDate.toISOString(), -bvBarringWeeksPre);
      const bvBarringEndDate = getDateFromWeekNumber(FirstDate.toISOString(), bvBarringWeeksPost);
      const bvBarringPeriodOverlap =
        !isBarred &&
        startDate &&
        endDate &&
        bvBarringStartDate &&
        bvBarringEndDate &&
        checkDateOverlap(
          { fromDate: givenStartDate, toDate: givenEndDate },
          { fromDate: bvBarringStartDate, toDate: bvBarringEndDate },
        );
      const bvBarredDistanceCheck =
        bvBarringPeriodOverlap && distance !== null && bvBarringMiles && distance <= bvBarringMiles;

      if (bvBarredDistanceCheck) {
        isBarred = true;
        info = info + `${bv.Name} bars ${uv.Name} for selected period \n`;
      }

      const uvBarringStartDate = getDateFromWeekNumber(startDate, -uvBarringWeeksPre);
      const uvBarringEndDate = getDateFromWeekNumber(endDate, uvBarringWeeksPost);
      const uvBarringPeriodOverlap =
        !isBarred &&
        uvBarringEndDate &&
        uvBarringStartDate &&
        FirstDate &&
        checkDateOverlap(
          { fromDate: uvBarringStartDate, toDate: uvBarringEndDate },
          { fromDate: new UTCDate(FirstDate), toDate: new UTCDate(FirstDate) },
        );
      const uvBarredDistanceCheck =
        uvBarringPeriodOverlap && distance !== null && uvBarringMiles && distance <= uvBarringMiles;

      if (uvBarredDistanceCheck) {
        isBarred = true;
        info = info + `${uv.Name} bars ${bv.Name} over period overlap \n`;
      }

      if (!isBarred) {
        info = 'No Barring Issues found';
      }

      const barredVenue = {
        id: bv.Id,
        bookingId: Id,
        name: bv.Name + ' ' + bv.Code,
        code: bv.Code,
        mileage: Number(distance),
        date: FirstDate.toISOString(),
        hasBarringConflict: isBarred,
        timeMins: venueVenueInfo.timeMins,
        info,
      };

      if (filterBarredVenues) {
        if (isBarred) results.push(barredVenue);
        continue;
      }
      results.push(barredVenue);
    }

    results = results.sort((a: BarredVenue, b: BarredVenue) => Number(a?.mileage || 0) - Number(b?.mileage || 0));

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
}
