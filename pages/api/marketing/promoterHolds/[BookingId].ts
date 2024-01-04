import { performanceMapper } from 'lib/mappers';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId = parseInt(req.query.BookingId as string);

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId });
    if (!access) return res.status(401).end();

    const performanceRaw = await prisma.performance.findMany({
      where: {
        BookingId,
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

    const result = [];
    for (const p of performanceRaw) {
      const note = p.AvailableComp[0]?.AvailableCompNotes || '';
      let totalAllocated = 0;
      let totalAvailable = 0;
      const allocated = [];
      let availableCompId: number;

      for (const ac of p.AvailableComp) {
        totalAvailable += ac.Seats;
        availableCompId = ac.Id;

        for (const ca of ac.CompAllocation) {
          allocated.push(ca);
          totalAllocated += ca.Seats;
        }
      }

      result.push({
        info: performanceMapper(p),
        note,
        availableCompId,
        totalAvailable,
        totalAllocated,
        allocated,
      });
    }

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while generating search results.' });
  }
}
