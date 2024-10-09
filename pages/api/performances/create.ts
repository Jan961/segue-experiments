import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';
import { PerformanceDTO } from 'interfaces';
import { dateStringToPerformancePair } from 'services/dateService';
import { performanceMapper } from 'lib/mappers';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const perf = req.body as PerformanceDTO;
    const { Date, Time } = dateStringToPerformancePair(perf.Date);
    const prisma = await getPrismaClient(req);

    const result = await prisma.performance.create({
      data: {
        Date,
        Time,
        Booking: {
          connect: {
            Id: perf.BookingId,
          },
        },
      },
    });
    console.log(`Created Performance: ${result.Id}`);
    res.status(200).json(performanceMapper(result));
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Error Creating Performance' });
  }
}
