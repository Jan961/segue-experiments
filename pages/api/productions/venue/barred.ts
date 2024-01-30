import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';
import { getEmailFromReq, checkAccess } from 'services/userService';

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
  const { venueId, productionId, excludeLondon } = req.body;

  const email = await getEmailFromReq(req);
  const access = await checkAccess(email, { ProductionId: productionId });
  if (!access) return res.status(401).end();

  try {
    const result = await prisma.VenueVenue.findMany({
      where: {
        Venue1Id: venueId,
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
