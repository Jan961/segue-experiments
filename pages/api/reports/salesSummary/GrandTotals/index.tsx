import getPrismaClient from 'lib/prisma';

export default async function handle(req, res) {
  const query =
    'SELECT WeekDate, SUM(GBPValue)  AS GBPTotal, SUM(RunSeatsOSld) AS TotalRunSeatsSold, SUM(TotalSeats) AS TotalTotalSeats,' +
    'FROM SalesSummary  ' +
    "WHERE Booking Status <> 'X' " +
    'GROUP BY WeekDate ' +
    'ORDER BY WeekDate';

  try {
    const result = await prisma.$queryRawUnsafe(`${query}`);
    res.json(result);
  } catch (e) {
    res.status(401);
  }
}
