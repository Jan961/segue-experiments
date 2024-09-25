import prisma from 'lib/prisma_master';

export const getAllCurrencyList = () => {
  return prisma.Currency.findMany({
    orderBy: {
      CurrencyCode: 'asc',
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
