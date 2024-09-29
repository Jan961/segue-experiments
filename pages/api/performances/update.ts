import getPrismaClient from 'lib/prisma';
import { PerformanceDTO } from 'interfaces';
import { performanceMapper } from 'lib/mappers';
import { dateStringToPerformancePair } from 'services/dateService';

export default async function handle(req, res) {
  try {
    const perf = req.body as PerformanceDTO;
    const prisma = await getPrismaClient(req);

    const { Date, Time } = dateStringToPerformancePair(perf.Date);
    const result = await prisma.performance.update({
      where: {
        Id: perf.Id,
      },
      data: {
        Time,
        Date,
      },
    });
    res.status(200).json(performanceMapper(result));
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred creating performance.' });
  }
}
