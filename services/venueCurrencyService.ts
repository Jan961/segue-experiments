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

    const venueCountryQuery: any | null = await prisma.VenueAddress.findFirst({
      where: {
        VenueId: { equals: venueId },
        TypeName: { equals: 'Main' },
      },
      select: {
        CountryId: true,
      },
    });
    const countryId: number | null = venueCountryQuery?.CountryId || null;

    const currencyCodeQuery: any | null = await prisma.Country.findFirst({
      where: {
        Id: { equals: countryId },
      },
      select: {
        CurrencyCode: true,
      },
    });
    const currencyCode: string | null = currencyCodeQuery?.CurrencyCode;

    const currencySymbolQuery: any | null = await prisma.Currency.findFirst({
      where: {
        Code: { equals: currencyCode },
      },
      select: {
        SymbolUnicode: true,
      },
    });
    const currencySymbol: string | null = currencySymbolQuery?.SymbolUnicode || null;

    return currencySymbol ? charCodeToCurrency(currencySymbol) : null;
  } catch (exception) {
    console.log(exception);
  }
};

export const getCurrencyCodeFromCountryId: (countryId: number) => Promise<any> = async (countryId: number) => {
  const currencyCodeQuery: any | null = await prisma.Country.findFirst({
    where: {
      Id: { equals: countryId },
    },
    select: {
      CurrencyCode: true,
    },
  });
  return currencyCodeQuery?.CurrencyCode;
};

export const getCurrencyFromProductionId: (productionId: number) => Promise<any> = async (productionId: number) => {
  const currencyCodeQuery: any | null = await prisma.Production.findFirst({
    where: {
      Id: { equals: productionId },
    },
    select: {
      ReportCurrencyCode: true,
    },
  });

  const currencySymbolQuery: any | null = await prisma.Currency.findFirst({
    where: {
      Code: { equals: currencyCodeQuery?.ReportCurrencyCode },
    },
    select: {
      SymbolUnicode: true,
    },
  });
  const currencySymbol: string | null = currencySymbolQuery?.SymbolUnicode || null;

  return currencySymbol ? charCodeToCurrency(currencySymbol) : null;
};
