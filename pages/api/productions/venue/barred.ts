import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';

export type BarredVenue = {
  Id: number;
  Name: string;
  Code: string;
  StatusCode: string;
  Mileage: number;
  TimeMins: number;
  BookingId: number;
  Date: string;
  town: string;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { venueId, productionId, excludeLondon, includeExcluded, barDistance, seats, startDate, endDate } = req.body;

  if (!venueId) return res.status(401).json({ errorMessage: 'Venue is required.', error: true });
  const prisma = await getPrismaClient(req);

  try {
    const result = await prisma.venueVenueTravelView.findMany({
      where: {
        Venue1Id: venueId,
        Venue2: {
          ...(!includeExcluded && { ExcludeFromChecks: false }),
        },
      },
      select: {
        Mileage: true,
        TimeMins: true,
        Venue2: {
          select: {
            Name: true,
            Code: true,
            Id: true,
            StatusCode: true,
            Booking: {
              select: {
                Id: true,
                FirstDate: true,
                DateBlock: {
                  select: {
                    ProductionId: true,
                    Name: true,
                  },
                },
              },
            },
            VenueAddress: {
              select: {
                Town: true,
              },
            },
          },
        },
      },
    });
    const filteredResults: BarredVenue[] = result
      .map(({ Mileage, TimeMins, Venue2 }) => {
        const { FirstDate, Id: BookingId } =
          Venue2.Booking.find((booking) => booking.DateBlock.ProductionId === productionId) || {};
        const { Name, Code, Id, StatusCode, VenueAddress } = Venue2;
        const town = VenueAddress?.[0]?.Town;
        if (!FirstDate) return null;
        const hasBarringConflict =
          (Mileage <= barDistance || Venue2.seats <= seats) &&
          (!startDate || new Date(startDate) >= new Date(FirstDate)) &&
          (!endDate || new Date(endDate) <= new Date(FirstDate));
        return {
          Id,
          Name,
          Code,
          StatusCode,
          Mileage,
          TimeMins,
          BookingId,
          Date: FirstDate,
          town,
          hasBarringConflict,
        };
      })
      .filter((x) => {
        if (excludeLondon) {
          return x && x.town !== 'London';
        }
        return x;
      })
      .sort((a: BarredVenue, b: BarredVenue) => a.Mileage - b.Mileage);
    res.json(filteredResults);
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: e.message });
  }
}
