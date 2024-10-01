import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';
import { Booking } from 'prisma/generated/prisma-client';
import { bookingMapperWithVenue } from 'lib/mappers';
import { BookingWithVenueDTO } from 'interfaces';
import { getDateTypeFromId } from 'services/dayTypeService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const prisma = await getPrismaClient(req);
    const { productionId, runTag } = req.body;
    const fromDate = new Date(req.body?.fromDate);
    const toDate = new Date(req.body?.toDate);
    fromDate.setUTCHours(0);
    toDate.setUTCHours(0);

    const conflictList = [];
    const performanceBookings: Booking[] = await prisma.booking.findMany({
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
              ...(req.body?.fromDate && { gte: fromDate }),
              ...(req.body?.toDate && { lte: toDate }),
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

    const result = await prisma.dateBlock.findMany({
      where: {
        ProductionId: productionId,
      },
      select: {
        GetInFitUp: true,
        Other: true,
        Rehearsal: true,
      },
    });

    for (const item of result) {
      const { GetInFitUp, Other, Rehearsal } = item;
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
              const dateTypeText = await getDateTypeFromId(DateTypeId, req);
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
    }

    const conflicts: BookingWithVenueDTO[] = performanceBookings
      .map(bookingMapperWithVenue)
      .sort((a, b) => new Date(a.Date).valueOf() - new Date(b.Date).valueOf());
    res.status(200).json([...conflicts, ...conflictList] || []);
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Error fetching report' });
  }
}
