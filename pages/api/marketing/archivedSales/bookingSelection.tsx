import { Prisma } from '@prisma/client';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { unique } from 'radash';
import { checkAccess, getAccountId, getEmailFromReq } from 'services/userService';
import { BookingSelection } from 'types/MarketingTypes';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(404);
    }
    const { venueCode, salesByType } = req.body || {};
    if (!venueCode || !salesByType) {
      throw new Error('Params are missing');
    }

    const email = await getEmailFromReq(req);
    const AccountId = await getAccountId(email);
    const access = await checkAccess(email, { AccountId });
    if (!access) return res.status(401).end();

    const conditions: Prisma.Sql[] = [];
    if (salesByType === 'venue') {
      conditions.push(Prisma.sql`VenueCode = ${venueCode}`);
    }

    if (salesByType === 'town') {
      const venue = await prisma.$queryRaw`Select * from VenueView where VenueCode=${venueCode}`;
      if (venue.length) {
        conditions.push(Prisma.sql`VenueMainAddressTown = ${venue?.[0]?.VenueMainAddressTown}`);
      } else {
        return res.status(404).send({ ok: false, message: 'Invalid venue code' });
      }
    }
    const where: Prisma.Sql = conditions.length ? Prisma.sql` where ${Prisma.join(conditions, ' and ')}` : Prisma.empty;
    const data: BookingSelection[] = await prisma.$queryRaw`select * FROM BookingSelectionView ${where};`;
    const results = [];
    const uniqueIds = {};
    const bookingIds = unique(data.map((booking) => booking.BookingId));
    const performances = await prisma.Performance.groupBy({
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

    if(data.length) {
      const venueId = data[0].VenueId;
      const performancesNoSales = await prisma.$queryRaw
        `SELECT BookingsForVenue
         FROM (SELECT BookingId AS BookingsForVenue
               FROM frtxigoo_dev.Booking
               WHERE BookingVenueId = ${venueId}) AS VenueBooking
         WHERE BookingsForVenue NOT IN (SELECT DISTINCT SetBookingId
                                        FROM frtxigoo_dev.SalesSet)
         ORDER BY BookingsForVenue ASC;`
    }

    const bookingPerformanceCountMap: Record<number, number> = performances.reduce((acc, curr) => {
      acc[curr.BookingId] = curr._count?.Id;
      return acc;
    }, {});

    data.forEach((selection) => {
      if (!uniqueIds[selection.ProductionId]) {
        uniqueIds[selection.ProductionId] = true; // Mark this id as seen
        results.push(selection); // Push the unique item to the result array
      }
    });
    res.send(
      results
        .map((booking) => ({ ...booking, PerformanceCount: bookingPerformanceCountMap[booking.BookingId] }))
        .sort((a, b) => a.BookingId - b.BookingId),
    );
  } catch (error) {
    console.log('Error:', error);
    res.status(500).send({ ok: false, message: error?.message });
  }
}
