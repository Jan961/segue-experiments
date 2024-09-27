import getPrismaClient from 'lib/prisma';

export default async function handle(req, res) {
  const date = new Date(req.query.date);
  try {
    const prisma = await getPrismaClient(req);
    const booking = await prisma.booking.findFirst({
      where: {
        ShowDate: date.toISOString(), // .toISO(req.query.date),
        ProductionId: parseInt(req.query.ProductionId),
      },
      include: {
        Venue: true,
        DateType: true,
      },
    });

    res.json(booking);

    res.statusCode = 200;
  } catch (err) {
    console.log('Generation error; this is the error: ' + err);
  }
}
