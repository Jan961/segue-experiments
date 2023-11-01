import { Prisma } from '@prisma/client';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { lookupShowCode } from 'services/ShowService';
import { checkAccess, getAccountId, getEmailFromReq } from 'services/userService';

type BookingSelectionView = {
  BookingId: number;
  BookingStatusCode: string;
  BookingFirstDate: string;
  VenueId: number;
  VenueCode: string;
  VenueMainAddressTown: string;
  TourId: number;
  FullTourCode: string;
  TourLengthWeeks: number;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(404);
    }
    const { venueCode, salesByType, showCode } = req.body || {};
    if (!venueCode || !salesByType || !showCode) {
      throw new Error('Params are missing');
    }

    const email = await getEmailFromReq(req);
    const AccountId = await getAccountId(email);
    const ShowId = await lookupShowCode(showCode, AccountId);
    const access = await checkAccess(email, { ShowId });
    if (!access) return res.status(401).end();

    const conditions: Prisma.Sql[] = [];
    // conditions.push(Prisma.sql`FullTourCode Like ${showCode + '%'}`)
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
    const data: BookingSelectionView[] = await prisma.$queryRaw`select * FROM BookingSelectionView ${where};`;
    const results = [];
    const uniqueIds = {};

    data.forEach((selection) => {
      if (!uniqueIds[selection.TourId]) {
        uniqueIds[selection.TourId] = true; // Mark this id as seen
        results.push(selection); // Push the unique item to the result array
      }
    });
    res.send(results.sort((a, b) => a.BookingId - b.BookingId));
  } catch (error) {
    console.log('Error:', error);
    res.status(500).send({ ok: false, message: error?.message });
  }
}
