import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

type CurrencyLookupParams = {
  BookingId: number;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { BookingId } = req.body as CurrencyLookupParams;

    const venueIdQuery: any | null = await prisma.Booking.findFirst({
      where: {
        Id: BookingId,
      },
      select: { VenueId: true },
    });
    const venueId: number | null = venueIdQuery ? venueIdQuery?.VenueId : null;

    const currencyCodeQuery: any | null = await prisma.Venue.findFirst({
      where: {
        Id: { equals: venueId },
      },
      select: {
        Currency: {
          select: { SymbolUnicode: true },
        },
      },
    });
    const currencyCode: string | null = currencyCodeQuery ? currencyCodeQuery.Currency.SymbolUnicode : null;
    return res.status(200).json({ currencyCode });
  } catch (exception) {
    console.log(exception);
    return res.status(403);
  }
}
