import prisma from 'lib/prisma';

const charCodeToCurrency = (charCode: string) => {
  return String.fromCharCode(Number('0x' + charCode));
};
export const getCurrencyFromBookingId = async (bookingId: number) => {
  try {
    const venueIdQuery: any | null = await prisma.Booking.findFirst({
      where: {
        Id: bookingId,
      },
      select: { VenueId: true },
    });
    const venueId = venueIdQuery ? venueIdQuery?.VenueId : null;
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
    return currencyCodeQuery ? charCodeToCurrency(currencyCodeQuery.Currency.SymbolUnicode) : null;
  } catch (exception) {
    console.log(exception);
  }
};