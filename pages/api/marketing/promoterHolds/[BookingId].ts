import { performanceMapper } from 'lib/mappers';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';
import { dateToSimple, getTimeFromDateAndTime } from 'services/dateService';

export const getPerformanceCompAllocationsByBookingId = async (bookingId: number) => {
  const performanceRaw = await prisma.performance.findMany({
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
        allocations.push({ ...ca, date: dateToSimple(p.Date), time: getTimeFromDateAndTime(p.Time) });
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

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId = parseInt(req.query.BookingId as string);
    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId });
    if (!access) return res.status(401).end();
    const { holds, allocations } = await getPerformanceCompAllocationsByBookingId(BookingId);
    res.json({ holds, allocations });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while generating search results.' });
  }
}
