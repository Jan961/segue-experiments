import getPrismaClient from 'lib/prisma';
import { performanceMapper } from 'lib/mappers';

export default async function handle(req, res) {
  try {
    const BookingId = parseInt(req.query.BookingId, 10);
    const prisma = await getPrismaClient(req);
    const performances: any[] = await prisma.performance.findMany({
      where: {
        BookingId,
      },
      select: {
        Id: true,
        Date: true,
        Time: true,
        BookingId: true,
      },
      orderBy: {
        Date: 'asc',
      },
    });
    res.status(200).json(performances.map((performance) => performanceMapper(performance)));
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred creating performance.' });
  }
}
