import prisma from 'lib/prisma_master';

export const getAllCurrencyList = () => {
  return prisma.Currency.findMany({
    orderBy: {
      CurrencyCode: 'asc',
    },
  });
};

export const getAllCountries = () => {
  return prisma.Country.findMany({
    orderBy: {
      CountryName: 'asc',
    },
  });
};

export const getCurrenciesAsSelectOptions = async () => {
  const currencies = await getAllCurrencyList();
  return currencies.map(({ CurrencyCode, CurrencyName }) => ({
    value: CurrencyCode,
    text: CurrencyName,
  }));
};

export const getCountriesAsSelectOptions = async () => {
  const countries = await getAllCountries();
  return countries.map(({ CountryId, CountryName }) => ({
    value: CountryId,
    text: CountryName,
  }));
};
