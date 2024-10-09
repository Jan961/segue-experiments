import getPrismaClient from 'lib/prisma';

export default async function handle(req, res) {
  const productionID = parseInt(req.query.productionId);
  const query = `SELECT DISTINCT WeekName, WeekDate, WeekCode FROM SalesSummaryView WHERE ProductionId = ${productionID}  ORDER BY  WeekDate`;

  try {
    const prisma = await getPrismaClient(req);
    const result = await prisma.$queryRawUnsafe(`${query}`);
    res.json(result);
  } catch (e) {
    res.status(401);
  }
}
