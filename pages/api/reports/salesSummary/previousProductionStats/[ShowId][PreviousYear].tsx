import getPrismaClient from 'lib/prisma';

export default async function handle(req, res) {
  const query =
    'SELECT * ' +
    'FROM ProductionWeekSummaryView  ' +
    `WHERE ShowId = ${req.query.ShowId} ` +
    `AND ProductionYear = ${req.query.PreviousYear}` +
    'GROUP BY WeekDate ' +
    'ORDER BY WeekDate';

  try {
    const prisma = await getPrismaClient(req);
    const result = await prisma.$queryRawUnsafe(`${query}`);
    res.json(result);
  } catch (e) {
    res.status(401);
  }
}
