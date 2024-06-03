import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

type CurrencyLookupParams = {
  BookingId: number;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { BookingId } = req.body as CurrencyLookupParams;

    const venueId: number = prisma.Booking.findFirst({
      where: {
        Id: BookingId,
      },
      select: { BookingVenueId: true },
    });

    const currencyCode: string = prisma.Venue.findFirst({
      where: {
        Id: venueId,
      },
      select: {
        Id: true,
        Currency: {
          select: { SymbolUnicode: true },
        },
      },
    });

    return res.status(200).json({ currencyCode });
  } catch (exception) {
    console.log(exception);
    return res.status(403);
  }
}
