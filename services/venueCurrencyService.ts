import getPrismaClient from 'lib/prisma';
import master from 'lib/prisma_master';
import { NextApiRequest } from 'next';

const charCodeToCurrency = (charCode: string) => {
  return String.fromCharCode(Number('0x' + charCode));
};

export const getCurrencyFromBookingId = async (req: NextApiRequest, bookingId: number, returnCurrencyCode = false) => {
  try {
    const prisma = await getPrismaClient(req);
    const venueIdQuery: any | null = await prisma.booking.findFirst({
      where: {
        Id: bookingId,
      },
      select: { VenueId: true },
    });

    const venueId = venueIdQuery?.VenueId || null;

    // return null if venueId is null
    if (!venueId) {
      return null;
    }

    const venueCountryQuery: any | null = await prisma.venueAddress.findFirst({
      where: {
        VenueId: { equals: venueId },
        TypeName: { equals: 'Main' },
      },
      select: {
        CountryId: true,
      },
    });

    const countryId: number | null = venueCountryQuery?.CountryId || null;

    // handling null, don't call next query if null
    if (!countryId) {
      return null;
    }

    const currencyCodeQuery: any | null = await prisma.country.findFirst({
      where: {
        Id: { equals: countryId },
      },
      select: {
        CurrencyCode: true,
      },
    });

    const currencyCode: string | null = currencyCodeQuery?.CurrencyCode;

    // if currencyCode is null, don't run the currency firstFirst query
    if (!currencyCode) {
      return null;
    }

    const currencySymbolQuery: any | null = await master.Currency.findFirst({
      where: {
        CurrencyCode: { equals: currencyCode },
      },
      select: {
        CurrencySymbolUnicode: true,
      },
    });

    const currencySymbol: string | null = currencySymbolQuery?.CurrencySymbolUnicode || null;

    return returnCurrencyCode ? currencyCode : charCodeToCurrency(currencySymbol);
  } catch (exception) {
    console.log(exception);
  }
};

export const getCurrencyCodeFromCountryId: (countryId: number, req: NextApiRequest) => Promise<any> = async (
  countryId: number,
  req: NextApiRequest,
) => {
  const prisma = await getPrismaClient(req);
  const currencyCodeQuery: any | null = await prisma.country.findFirst({
    where: {
      Id: { equals: countryId },
    },
    select: {
      CurrencyCode: true,
    },
  });
  return currencyCodeQuery?.CurrencyCode;
};

export const getCurrencyFromProductionId = async (
  req: NextApiRequest,
  productionId: number,
  returnCurrencyCode = false,
) => {
  try {
    const prisma = await getPrismaClient(req);
    // Query to get the ReportCurrencyCode from Production
    const currencyCodeQuery: any | null = await prisma.production.findFirst({
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
    const currencySymbolQuery: any | null = await master.Currency.findFirst({
      where: {
        CurrencyCode: { equals: currencyCode },
      },
      select: {
        CurrencySymbolUnicode: true,
      },
    });

    // Extract the currency symbol from the query result
    const currencySymbol: string | null = currencySymbolQuery?.CurrencySymbolUnicode || null;

    return returnCurrencyCode ? currencyCode : charCodeToCurrency(currencySymbol);
  } catch (exception) {
    console.log(exception);
    return null;
  }
};
