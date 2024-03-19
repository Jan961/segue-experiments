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
    const givenVenue = await prisma.venue.findUnique({
      where: { Id: VenueId },
    });
    const {
      BarringWeeksPost: givenVenueBarringWeeksPost,
      BarringWeeksPre: givenVenueBarringWeeksPre,
      BarringMiles: givenVenueBarringMiles,
    } = givenVenue;
    // Get all venues within the production, their bookings, and distances to the given venue
    const bookingsWithDistances = await prisma.booking.findMany({
      where: {
        DateBlock: { ProductionId },
      },
      include: {
        Venue: {
          include: {
            VenueVenue1: { where: { Venue2Id: VenueId } },
            VenueVenue2: { where: { Venue1Id: VenueId } },
          },
        },
      },
    });

    const results = bookingsWithDistances
      .map(({ Venue, FirstDate }) => {
        const distanceInfo1 = Venue.VenueVenue1[0];
        const distanceInfo2 = Venue.VenueVenue2[0];
        const distanceInfo = distanceInfo1 || distanceInfo2 || null;
        const distance = distanceInfo.Mileage;
        const { BarringWeeksPost, BarringWeeksPre, BarringMiles } = Venue;
        let barringPeriodOverlap = false;
        if (startDate && endDate && BarringWeeksPost && BarringWeeksPre) {
          const barringStartDate = getDateFromWeekNumber(FirstDate.toISOString(), -Venue.BarringWeeksPre);
          const barringEndDate = getDateFromWeekNumber(FirstDate.toISOString(), Venue.BarringWeeksPost);
          barringPeriodOverlap = checkDateOverlap(
            givenStartDate,
            givenEndDate,
            new Date(barringStartDate),
            new Date(barringEndDate),
          );
        }
        let givenVenueBarringPeriodOverlap = false;
        if (
          givenVenueBarringWeeksPost &&
          givenVenueBarringWeeksPre &&
          BarringWeeksPost &&
          BarringWeeksPost &&
          startDate &&
          endDate
        ) {
          const barringStartDate = getDateFromWeekNumber(FirstDate.toISOString(), -Venue.BarringWeeksPre);
          const barringEndDate = getDateFromWeekNumber(FirstDate.toISOString(), Venue.BarringWeeksPost);
          const givenVenueBarringStartDate = getDateFromWeekNumber(startDate, -Venue.BarringWeeksPre);
          const givenVenueBarringEndDate = getDateFromWeekNumber(endDate, Venue.BarringWeeksPost);
          givenVenueBarringPeriodOverlap = checkDateOverlap(
            new Date(givenVenueBarringStartDate),
            new Date(givenVenueBarringEndDate),
            new Date(barringStartDate),
            new Date(barringEndDate),
          );
        }

        // Determine if within barring distance and meets seat requirements
        const seatsCheck = Venue.Seats <= Seats;
        const mileageCheck =
          (distance !== null && distance <= Miles) ||
          (BarringMiles && BarringMiles <= Miles) ||
          (distance !== null && givenVenueBarringMiles && distance.lte(givenVenueBarringMiles));
        // Determine if barred based on combined criteria
        const isBarred = barringPeriodOverlap || givenVenueBarringPeriodOverlap || seatsCheck || mileageCheck;

        return {
          Id: Venue.Id,
          Name: Venue.Name,
          Mileage: distance,
          Date: FirstDate,
          hasBarringConflict: isBarred,
        };
      })
      .sort((a, b) => Number(a.Mileage) - Number(b.Mileage));

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
}
