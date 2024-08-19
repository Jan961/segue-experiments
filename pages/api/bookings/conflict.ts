import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';
import { Booking } from 'prisma/generated/prisma-client';
import { bookingMapperWithVenue } from 'lib/mappers';
import { BookingWithVenueDTO } from 'interfaces';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { fromDate, toDate, ProductionId, runTag } = req.body;
    const results: Booking[] = await prisma.booking.findMany({
      where: {
        FirstDate: {
          ...(fromDate && { gte: new Date(fromDate) }),
          ...(toDate && { lte: new Date(toDate) }),
        },
        DateBlock: {
          is: {
            ProductionId,
          },
        },
        StatusCode: {
          in: ['C', 'U'],
        },
        RunTag: {
          not: { equals: runTag },
        },
      },
      include: {
        DateBlock: true,
        Venue: true,
      },
    });

    const conflicts: BookingWithVenueDTO[] = results
      .map(bookingMapperWithVenue)
      .sort((a, b) => new Date(a.Date).valueOf() - new Date(b.Date).valueOf());
    res.status(200).json(conflicts || []);
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Error fetching report' });
  }
}
