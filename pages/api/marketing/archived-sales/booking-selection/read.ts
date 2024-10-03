import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { unique } from 'radash';
import { BookingSelection } from 'types/MarketingTypes';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(404).end();
    }
    const prisma = await getPrismaClient(req);

    const { venueCode, salesByType } = req.body || {};
    if (!venueCode || !salesByType) {
      throw new Error('Params are missing');
    }

    let conditions = {};

    if (salesByType === 'venue') {
      conditions = { VenueCode: venueCode };
    }

    if (salesByType === 'town') {
      const venue = await prisma.venueView.findFirst({
        where: { VenueCode: venueCode },
      });

      if (venue) {
        conditions = { VenueMainAddressTown: venue.VenueMainAddressTown };
      } else {
        return res.status(404).send({ ok: false, message: 'Invalid venue code' });
      }
    }

    const data: BookingSelection[] = await prisma.bookingSelectionView.findMany({
      where: conditions,
    });

    const results = [];
    const uniqueIds = {};
    const bookingIds = unique(data.map((booking) => booking.BookingId));

    const performances = await prisma.performance.groupBy({
      by: ['BookingId'],
      _count: {
        Id: true,
      },
      where: {
        BookingId: {
          in: bookingIds,
        },
      },
    });

    const venueId = data[0]?.VenueId;

    if (venueId === undefined) {
      return res.status(404).send({ ok: false, message: 'No venue data found' });
    }

    try {
      const bookingsForVenue = await prisma.booking.findMany({
        where: {
          VenueId: venueId,
        },
        select: {
          Id: true,
        },
      });

      const bookingsForVenueIds = bookingsForVenue.map((booking) => booking.Id);

      const salesSetBookingIds = await prisma.salesSet.findMany({
        distinct: ['SetBookingId'],
        select: {
          SetBookingId: true,
        },
      });

      const salesSetBookingIdsList = salesSetBookingIds.map((saleSet) => saleSet.SetBookingId);

      const performancesNoSales = bookingsForVenueIds.filter(
        (bookingId) => !salesSetBookingIdsList.includes(bookingId),
      );

      const bookingPerformanceCountMap = performances.reduce((acc, curr) => {
        acc[curr.BookingId] = curr._count?.Id;
        return acc;
      }, {});

      data.forEach((selection) => {
        if (!uniqueIds[selection.ProductionId]) {
          uniqueIds[selection.ProductionId] = true; // Mark this id as seen
          selection.HasSalesData = !performancesNoSales.includes(selection.BookingId);
          results.push(selection); // Push the unique item to the result array
        }
      });

      res.send(
        results
          .map((booking) => ({ ...booking, PerformanceCount: bookingPerformanceCountMap[booking.BookingId] }))
          .sort((a, b) => a.BookingId - b.BookingId),
      );
    } catch (exception) {
      console.log('Query Failed', exception);
      res.status(500).send({ ok: false, message: 'Query Failed' });
    }
  } catch (error) {
    console.log('Error:', error);
    res.status(500).send({ ok: false, message: error?.message });
  }
}
