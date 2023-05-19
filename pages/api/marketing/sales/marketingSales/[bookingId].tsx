import prisma from 'lib/prisma'

export default async function handle(req, res) {
  const { bookingId } = req.query;

  let query = `SELECT * FROM BookingSale WHERE BookingId = ${bookingId}`;

  try {
    let result = await prisma.$queryRawUnsafe(`${query}`);
    res.json(result);
  } catch (e) {
    res.status(401);
  }
}
