import getPrismaClient from 'lib/prisma';
import { newDate } from 'services/dateService';

export default async function handle(req, res) {
  const ProductionId = req.query.ProductionId;
  const FromWeek = newDate(req.query.FromWeek); // Selected week
  const ToWeek = newDate(req.query.ToWeek); // Selected week -  number of weeks
  let FromProductionDate = null;
  if (req.query.FromProductionDate !== 'Null' || req.query.FromProductionDate !== 'null') {
    FromProductionDate = newDate(req.query.FromProductionDate);
  }
  let ToProductionDate = null;
  if (req.query.ToProductionDate !== 'Null' || req.query.ToProductionDate !== 'Null') {
    ToProductionDate = newDate(req.query.ToProductionDate);
  }
  try {
    const prisma = await getPrismaClient(req);
    if (req.query.options === 'data') {
      const result =
        await prisma.$queryRaw`SELECT * FROM \`SalesSummaryView\` WHERE \`ProductionId\` = ${ProductionId} AND \`ShowDate\` >= ${FromProductionDate}  AND \`WeekDate\` BETWEEN ${FromWeek} AND ${ToWeek}  AND (IsNull(${FromProductionDate})
                Or (ShowDate >= ${FromProductionDate})) AND (IsNull(${ToProductionDate}) Or (ShowDate <= ${ToProductionDate}))
                ;`;
      res.json(result);
    } else if (req.query.options === 'CurrencyWeekTotals') {
      const result = await prisma.$queryRaw`
                    SELECT VenueCurrency, VenueCurrency, ConversionRate, ProductionWeekNum, WeekDate, SUM(Value) AS Total, SUM(RunSeatsSold) AS TotalRunSeatsSold, SUM(TotalSeats) AS TotalTotalSeats
                    FROM SalesSummaryView
                    WHERE \`ProductionId\` = ${ProductionId} AND \`ShowDate\` >= ${FromProductionDate}  AND \`WeekDate\` BETWEEN ${FromWeek} AND ${ToWeek}  AND (IsNull(${FromProductionDate})
                        Or (ShowDate >= ${FromProductionDate})) AND (IsNull(${ToProductionDate}) Or (ShowDate <= ${ToProductionDate}))
                    GROUP BY ProductionWeekNum, VenueCurrency, Symbol, ConversionRate, WeekDate
                    ORDER BY ProductionWeekNum, VenueCurrency, Symbol, ConversionRate, WeekDate
                               `;
      res.json(result);
    } else if (req.query.options === 'weeks') {
      const result =
        await prisma.$queryRaw`SELECT DISTINCT WeekName, WeekDate, WeekCode FROM \`SalesSummaryView\` WHERE \`ProductionId\` = ${ProductionId} AND \`ShowDate\` >= ${FromProductionDate}  AND \`WeekDate\` BETWEEN ${FromWeek} AND ${ToWeek}  AND (IsNull(${FromProductionDate})
                Or (ShowDate >= ${FromProductionDate})) AND (IsNull(${ToProductionDate}) Or (ShowDate <= ${ToProductionDate})) ORDER BY  WeekDate`;
      res.json(result);
    }
  } catch (e) {
    res.status(500).send('Internal server error');
  }
}
