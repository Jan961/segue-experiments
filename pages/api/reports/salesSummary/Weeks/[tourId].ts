import prisma from 'lib/prisma';

export default async function handle(req, res) {
  const tourID = parseInt(req.query.tourId);
  const query = `SELECT DISTINCT WeekName, WeekDate, WeekCode FROM SalesSummaryView WHERE TourId = ${tourID}  ORDER BY  WeekDate`;

  try {
    const result = await prisma.$queryRawUnsafe(`${query}`);
    res.json(result);
  } catch (e) {
    res.status(401);
  }
}
