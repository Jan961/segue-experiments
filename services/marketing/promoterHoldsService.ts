import { UTCDate } from '@date-fns/utc';
import { performanceMapper } from 'lib/mappers';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest } from 'next';
import { dateToSimple, dateTimeToTime } from 'services/dateService';
import { isNull } from 'utils';

export const getPerformanceCompAllocationsByBookingId = async (bookingId: number, req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  const performanceRaw = await prisma.performance
    .findMany({
      where: {
        BookingId: bookingId,
      },
      orderBy: [
        {
          Date: 'asc',
        },
        {
          Time: 'asc',
        },
      ],
      include: {
        AvailableComp: {
          include: {
            CompAllocation: true,
          },
        },
      },
    })
    .then((res) => {
      const r = res.map((e) => {
        return { ...e, Date: new UTCDate(e.Date), Time: new UTCDate(e.Time) };
      });
      return r;
    });

  const holds = [];
  const allocations = [];
  for (const p of performanceRaw) {
    const note = p.AvailableComp[0]?.AvailableCompNotes || '';

    let totalAllocated = 0;
    let totalAvailable = 0;
    let availableCompId: number;

    for (const ac of p.AvailableComp) {
      totalAvailable += ac.Seats;
      availableCompId = ac.Id;

      for (const ca of ac.CompAllocation) {
        allocations.push({
          ...ca,
          date: dateToSimple(p.Date),
          time: isNull(p.Time) ? 'TBC' : dateTimeToTime(p.Time),
        });
        totalAllocated += ca.Seats;
      }
    }

    holds.push({
      info: performanceMapper(p),
      note,
      availableCompId,
      totalAvailable,
      totalAllocated,
    });
  }
  return { holds, allocations };
};
