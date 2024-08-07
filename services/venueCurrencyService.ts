import prisma from 'lib/prisma';

const charCodeToCurrency = (charCode: string) => {
  return String.fromCharCode(Number('0x' + charCode));
};

export const getCurrencyFromBookingId = async (bookingId: number, returnCurrencyCode = false) => {
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

    if (currencySymbol) {
      return returnCurrencyCode ? currencyCode : charCodeToCurrency(currencySymbol);
    } else {
      return null;
    }
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

export const getCurrencyFromProductionId = async (productionId: number, returnCurrencyCode = false) => {
  try {
    // Query to get the ReportCurrencyCode from Production
    const currencyCodeQuery: any | null = await prisma.Production.findFirst({
      where: {
        Id: { equals: productionId },
      },
      select: {
        ReportCurrencyCode: true,
      },
    });

    // Extract the currency code from the query result
    const currencyCode: string | null = currencyCodeQuery?.ReportCurrencyCode || null;

    // If currencyCode is null, return null
    if (!currencyCode) {
      return null;
    }

    // Query to get the currency symbol using the currency code
    const currencySymbolQuery: any | null = await prisma.Currency.findFirst({
      where: {
        Code: { equals: currencyCode },
      },
      select: {
        SymbolUnicode: true,
      },
    });

    // Extract the currency symbol from the query result
    const currencySymbol: string | null = currencySymbolQuery?.SymbolUnicode || null;

    // If returnCharCode is true, return the currencySymbol (charCode), otherwise return the currency name
    if (currencySymbol) {
      return returnCurrencyCode ? currencyCode : charCodeToCurrency(currencySymbol);
    } else {
      return null;
    }
  } catch (exception) {
    console.log(exception);
    return null;
  }
};
