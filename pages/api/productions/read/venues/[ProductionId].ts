import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { omit } from 'radash';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const ProductionId = parseInt(req.query.ProductionId as string);

    const prisma = await getPrismaClient(req);

    // TO be implimnented when Prisma supports this
    const result = await prisma.dateBlock.findFirst({
      where: {
        ProductionId,
        Name: 'Production',
      },
      include: {
        Booking: {
          include: {
            Venue: {
              include: {
                VenueAddress: true,
              },
            },
          },
        },
      },
      orderBy: {
        StartDate: 'desc',
      },
    });
    const bookings = result.Booking.map((booking) => ({
      booking: omit(booking, ['Venue']),
      ...(booking.Venue || {}),
      ...(booking.Venue?.VenueAddress?.[0] || {}),
      BookingId: booking.Id,
    }));
    res.json(bookings);
  } catch (error) {
    console.log('==Error fetching Venue bookings==', error);
    res.status(500).end();
  }
}
