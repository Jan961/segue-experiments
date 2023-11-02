import prisma from 'lib/prisma';

export default async function handle(req, res) {
  const query =
    'SELECT * ' +
    'FROM TourWeekSummaryView  ' +
    `WHERE ShowId = ${req.query.ShowId} ` +
    `AND TourYear = ${req.query.PreviousYear}` +
    'GROUP BY WeekDate ' +
    'ORDER BY WeekDate';

  try {
    const result = await prisma.$queryRawUnsafe(`${query}`);
    res.json(result);
  } catch (e) {
    res.status(401);
  }
}
