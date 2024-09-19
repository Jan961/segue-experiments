import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';
import { Booking } from 'prisma/generated/prisma-client';
import { bookingMapperWithVenue } from 'lib/mappers';
import { BookingWithVenueDTO } from 'interfaces';
import { getDateTypeFromId } from 'services/getDateTypeFromId';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { productionId, runTag } = req.body;
    const fromDate = new Date(req.body?.fromDate);
    const toDate = new Date(req.body?.toDate);

    const result = await prisma.DateBlock.findFirst({
      where: {
        ProductionId: productionId,
        IsPrimary: true,
      },
      select: {
        GetInFitUp: true,
        Other: true,
        Rehearsal: true,
      },
    });
    const { GetInFitUp, Other, Rehearsal } = result;
    const conflictList = [];
    GetInFitUp?.forEach((getIn) => {
      const { StatusCode, Date } = getIn;
      if (StatusCode === 'C' || StatusCode === 'U') {
        if (fromDate <= Date && Date <= toDate) {
          conflictList.push({ ...getIn, Venue: { Name: 'Get In' } });
        }
      }
    });
    await Promise.all(
      (Other || []).map(async (otherBooking) => {
        const { StatusCode, Date, DateTypeId } = otherBooking;
        if (StatusCode === 'C' || StatusCode === 'U') {
          if (fromDate <= Date && Date <= toDate) {
            const dateTypeText = await getDateTypeFromId(DateTypeId);
            conflictList.push({ ...otherBooking, Venue: { Name: dateTypeText } });
          }
        }
      }),
    );

    Rehearsal?.forEach((rehearsalBooking) => {
      const { StatusCode, Date } = rehearsalBooking;
      if (StatusCode === 'C' || StatusCode === 'U') {
        if (fromDate <= Date && Date <= toDate) {
          conflictList.push({ ...rehearsalBooking, Venue: { Name: 'Rehearsal' } });
        }
      }
    });

    const results: Booking[] = await prisma.booking.findMany({
      where: {
        DateBlock: {
          is: {
            ProductionId: productionId,
          },
        },
        StatusCode: {
          in: ['C', 'U'],
        },
        RunTag: {
          not: { equals: runTag },
        },
        Performance: {
          some: {
            Date: {
              ...(fromDate && { gte: new Date(fromDate) }),
              ...(toDate && { lte: new Date(toDate) }),
            },
          },
        },
      },
      include: {
        DateBlock: true,
        Venue: true,
        Performance: true,
      },
    });

    const conflicts: BookingWithVenueDTO[] = results
      .map(bookingMapperWithVenue)
      .sort((a, b) => new Date(a.Date).valueOf() - new Date(b.Date).valueOf());
    res.status(200).json([...conflicts, ...conflictList] || []);
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Error fetching report' });
  }
}
