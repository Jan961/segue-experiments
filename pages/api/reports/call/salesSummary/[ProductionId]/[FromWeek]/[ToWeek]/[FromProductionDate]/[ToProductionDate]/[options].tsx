import prisma from 'lib/prisma';

export default async function handle(req, res) {
  const ProductionId = req.query.ProductionId;
  const FromWeek = new Date(req.query.FromWeek); // Selected week
  const ToWeek = new Date(req.query.ToWeek); // Selected week -  number of weeks
  let FromProductionDate = null;
  if (req.query.FromProductionDate !== 'Null' || req.query.FromProductionDate !== 'null') {
    FromProductionDate = new Date(req.query.FromProductionDate);
  }
  let ToProductionDate = null;
  if (req.query.ToProductionDate !== 'Null' || req.query.ToProductionDate !== 'Null') {
    ToProductionDate = new Date(req.query.ToProductionDate);
  }

  if (req.query.options === 'data') {
    try {
      const result =
        await prisma.$queryRaw`SELECT * FROM \`SalesSummaryView\` WHERE \`ProductionId\` = ${ProductionId} AND \`ShowDate\` >= ${FromProductionDate}  AND \`WeekDate\` BETWEEN ${FromWeek} AND ${ToWeek}  AND (IsNull(${FromProductionDate})
                Or (ShowDate >= ${FromProductionDate})) AND (IsNull(${ToProductionDate}) Or (ShowDate <= ${ToProductionDate}))
                ;`;
      res.json(result);
    } catch (e) {
      res.statusCode(400);
    }
  } else if (req.query.options === 'CurrencyWeekTotals') {
    try {
      const result = await prisma.$queryRaw`
                    SELECT VenueCurrency, VenueCurrency, ConversionRate, ProductionWeekNum, WeekDate, SUM(Value) AS Total, SUM(RunSeatsSold) AS TotalRunSeatsSold, SUM(TotalSeats) AS TotalTotalSeats
                    FROM SalesSummaryView
                    WHERE \`ProductionId\` = ${ProductionId} AND \`ShowDate\` >= ${FromProductionDate}  AND \`WeekDate\` BETWEEN ${FromWeek} AND ${ToWeek}  AND (IsNull(${FromProductionDate})
                        Or (ShowDate >= ${FromProductionDate})) AND (IsNull(${ToProductionDate}) Or (ShowDate <= ${ToProductionDate}))
                    GROUP BY ProductionWeekNum, VenueCurrency, Symbol, ConversionRate, WeekDate
                    ORDER BY ProductionWeekNum, VenueCurrency, Symbol, ConversionRate, WeekDate
                               `;
      res.json(result);
    } catch (e) {
      res.statusCode(400);
    }
  } else if (req.query.options === 'weeks') {
    try {
      const result =
        await prisma.$queryRaw`SELECT DISTINCT WeekName, WeekDate, WeekCode FROM \`SalesSummaryView\` WHERE \`ProductionId\` = ${ProductionId} AND \`ShowDate\` >= ${FromProductionDate}  AND \`WeekDate\` BETWEEN ${FromWeek} AND ${ToWeek}  AND (IsNull(${FromProductionDate})
                Or (ShowDate >= ${FromProductionDate})) AND (IsNull(${ToProductionDate}) Or (ShowDate <= ${ToProductionDate})) ORDER BY  WeekDate`;
      res.json(result);
    } catch (e) {
      res.statusCode(400);
    }
  } 
}
