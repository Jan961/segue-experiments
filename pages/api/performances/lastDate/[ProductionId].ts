import getPrismaClient from 'lib/prisma';

export default async function handle(req, res) {
  try {
    const ProductionId = parseInt(req.query.ProductionId, 10);
    const prisma = await getPrismaClient(req);

    const lastDates =
      await prisma.$queryRaw`select BookingId, max(PerformanceDate) as LastPerformanceDate from Performance
      inner join Booking on Performance.PerformanceBookingId = Booking.BookingId
      inner join DateBlock on Booking.BookingDateBlockId = DateBlock.DateBlockId
      where DateBlock.DateBlockProductionId = ${ProductionId}
      group by BookingId`;

    res.status(200).json(lastDates);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred getting PerformanceLastDates.' });
  }
}
