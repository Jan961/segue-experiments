import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { checkDateOverlap } from 'services/dateService';
import { getDateFromWeekNumber } from 'utils/getDateFromWeekNum';

const prisma = new PrismaClient();

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
    barDistance: Miles,
    seats: Seats,
  } = req.body;

  if (!ProductionId || !VenueId) {
    return res.status(400).json({ message: 'ProductionId and VenueId are required.' });
  }
  try {
    const givenStartDate = new Date(startDate);
    const givenEndDate = new Date(endDate);
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
        ...(Seats && {
          Venue: {
            is: {
              Seats: {
                gte: Seats,
              },
            },
          },
        }),
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

    const results = bookingsWithDistances
      .map(({ Venue: bv, FirstDate }) => {
        // bv stands for booked Venue, All the venues booked on the specified production
        let info = '';
        let isBarred = false;
        const distanceInfo1 = bv.VenueVenue1[0];
        const distanceInfo2 = bv.VenueVenue2[0];
        const distanceInfo = distanceInfo1 || distanceInfo2 || null;
        const distance = distanceInfo?.Mileage;
        const {
          BarringWeeksPost: bvBarringWeeksPost,
          BarringWeeksPre: bvBarringWeeksPre,
          BarringMiles: bvBarringMiles,
        } = bv;

        // Determine if within barring distance
        const mileageCheck = distance !== null && distance <= Miles;
        if (mileageCheck) {
          isBarred = true;
          info = info + `${uv.Name} is within ${Miles} of ${bv.Name} `;
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
          checkDateOverlap(givenStartDate, givenEndDate, new Date(bvBarringStartDate), new Date(bvBarringEndDate));
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
          bvBarringStartDate &&
          bvBarringEndDate &&
          checkDateOverlap(
            new Date(uvBarringStartDate),
            new Date(uvBarringEndDate),
            new Date(bvBarringStartDate),
            new Date(bvBarringEndDate),
          );
        const uvBarredDistanceCheck =
          uvBarringPeriodOverlap && distance !== null && uvBarringMiles && distance?.lte(uvBarringMiles);
        const uvBarredVenueCheck = uvBarringPeriodOverlap && uvBarredVenueList.includes(bv.Id);
        if (uvBarredDistanceCheck || uvBarredVenueCheck) {
          isBarred = true;
          info = info + `${uv.Name} bars ${bv.Name} over period overlap \n`;
        }

        return {
          id: bv.Id,
          name: bv.Name,
          code: bv.Code,
          mileage: distance,
          date: FirstDate,
          hasBarringConflict: isBarred,
          info,
        };
      })
      .sort((a, b) => Number(a?.mileage || 0) - Number(b?.mileage || 0));

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
}
