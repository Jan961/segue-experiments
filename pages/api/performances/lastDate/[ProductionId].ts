import prisma from 'lib/prisma';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req, res) {
  try {
    const ProductionId = parseInt(req.query.ProductionId, 10);

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { ProductionId });
    if (!access) return res.status(401).end();

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
