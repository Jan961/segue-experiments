import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

type CurrencyLookupParams = {
  searchValue: number;
  inputType: string;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { searchValue, inputType } = req.body as CurrencyLookupParams;
    let venueId;
    switch (inputType) {
      case 'bookingId': {
        const venueIdQuery: any | null = await prisma.Booking.findFirst({
          where: {
            Id: searchValue,
          },
          select: { VenueId: true },
        });
        venueId = venueIdQuery ? venueIdQuery?.VenueId : null;
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
      }
      case 'venueId': {
        venueId = searchValue;
      }
    }

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
