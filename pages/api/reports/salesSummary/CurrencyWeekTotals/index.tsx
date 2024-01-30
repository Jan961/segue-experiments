import prisma from 'lib/prisma';

export default async function handle(req, res) {
  const query =
    'SELECT VenueCurrency, Symbol, ConversionRate, ProductionWeekNum, Sum(Value) As Totla, Sum(RunDeatsSold) As TotlaRunSeatsSold, Sum(TotalRunSeats) As TotalSeats ' +
    'FROM SalesSummary  ' +
    "WHERE Booking Status <> 'X' " +
    'GROUP BY ProductionWeekNum, VenueCurrency, Symbol, ConversionRate, WeekDate ' +
    'ORDER BY ProductionWeekNum, VenueCurrency, Symbol, ConversionRate, WeekDate';

  try {
    const result = await prisma.$queryRawUnsafe(`${query}`);
    res.json(result);
  } catch (e) {
    res.status(401);
  }
}
