import getPrismaClient from 'lib/prisma';

export default async function handle(req, res) {
  const query = 'SELECT * FROM SalesSummaryView ORDER BY ShowDate, WeekDate';

  try {
    const prisma = await getPrismaClient(req);
    const result = await prisma.$queryRawUnsafe(`${query}`);
    res.json(result);
  } catch (e) {
    res.status(401);
  }
}
