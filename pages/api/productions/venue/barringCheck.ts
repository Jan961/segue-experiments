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
    // uv stands for user venue, The venue the user selected to do a barring check for
    const uv = await prisma.venue.findUnique({
      where: { Id: VenueId },
      include: {
        VenueBarredVenue_VenueBarredVenue_VBVVenueIdToVenue: true,
      },
    });
    const {
      BarringWeeksPost: uvBarringWeeksPost,
      BarringWeeksPre: uvBarringWeeksPre,
      BarringMiles: uvBarringMiles,
    } = uv;
    const uvBarredVenueList = uv.VenueBarredVenue_VenueBarredVenue_VBVVenueIdToVenue?.map(
      (barredVenue) => barredVenue.BarredVenueId,
    );
    // Get all venues within the production, their bookings, and distances to the given venue
    const bookingsWithDistances = await prisma.booking.findMany({
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
        Venue: {
          include: {
            VenueVenue1: { where: { Venue2Id: VenueId } },
            VenueVenue2: { where: { Venue1Id: VenueId } },
            VenueBarredVenue_VenueBarredVenue_VBVVenueIdToVenue: true,
          },
        },
      },
    });
    let results: BarredVenue[] = [];
    for (const { Venue: bv, FirstDate, Id } of bookingsWithDistances) {
      // bv stands for booked Venue, All the venues booked on the specified production
      let info = '';
      let isBarred = false;
      const venueVenueInfo1 = bv.VenueVenue1[0];
      const venueVenueInfo2 = bv.VenueVenue2[0];
      const venueVenueInfo = venueVenueInfo1 || venueVenueInfo2 || null;
      const distance = venueVenueInfo?.Mileage;
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

      const bvBarredVenueList = bv.VenueBarredVenue_VenueBarredVenue_VBVVenueIdToVenue.map(
        (barredVenue) => barredVenue.BarredVenueId,
      );

      const bvBarringStartDate = getDateFromWeekNumber(FirstDate.toISOString(), -bvBarringWeeksPre);
      const bvBarringEndDate = getDateFromWeekNumber(FirstDate.toISOString(), bvBarringWeeksPost);
      const bvBarringPeriodOverlap =
        !isBarred &&
        startDate &&
        endDate &&
        bvBarringStartDate &&
        bvBarringEndDate &&
        // checkDateOverlap(givenStartDate, givenEndDate, new Date(bvBarringStartDate), new Date(bvBarringEndDate));
        checkDateOverlap(
          { fromDate: givenStartDate, toDate: givenEndDate },
          { fromDate: bvBarringStartDate, toDate: bvBarringEndDate },
        );
      const bvBarredDistanceCheck =
        bvBarringPeriodOverlap && distance !== null && bvBarringMiles && distance?.lte(bvBarringMiles);
      const bvBarredVenueCheck = bvBarringPeriodOverlap && bvBarredVenueList.includes(uv.Id);
      if (bvBarredDistanceCheck || bvBarredVenueCheck) {
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
        uvBarringPeriodOverlap && distance !== null && uvBarringMiles && distance?.lte(uvBarringMiles);
      const uvBarredVenueCheck = uvBarringPeriodOverlap && uvBarredVenueList.includes(bv.Id);
      if (uvBarredDistanceCheck || uvBarredVenueCheck) {
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
        timeMins: venueVenueInfo.TimeMins,
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
