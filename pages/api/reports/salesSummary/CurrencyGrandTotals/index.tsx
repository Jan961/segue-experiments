import getPrismaClient from 'lib/prisma';

export default async function handle(req, res) {
  const query =
    'SELECT VenueCurrency, Symbol, ConversionRate, WeekDate, Sum(Value) As Total, Sum RunSeats AS TotalRunSeatsSold, SUM(TotalSeats) AS TotalTotalSeats  ' +
    'FROM SalesSummary  ' +
    "WHERE Booking Status <> 'X' " +
    'GROUP BY ProductionWeekNum, VenueCurrency, Symbol, ConversionRate, WeekDate ' +
    'ORDER BY ProductionWeekNum, VenueCurrency, Symbol, ConversionRate, WeekDate';

  try {
    const prisma = await getPrismaClient(req);
    const result = await prisma.$queryRawUnsafe(`${query}`);
    res.json(result);
  } catch (e) {
    res.status(401);
  }
}
