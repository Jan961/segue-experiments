import getPrismaClient from 'lib/prisma';

export default async function handle(req, res) {
  const archived = req.query.archived;

  try {
    const prisma = await getPrismaClient(req);
    const searchResults =
      await prisma.$queryRaw`SELECT * FROM ProductionView WHERE Archived = ${archived} AND ProductionEndDate <= ${req.query.date}  ORDER BY ProductionStartDate`;

    res.json(searchResults);
  } catch (err) {
    console.log('Generation error; this is the error: ' + err);
  }
}
