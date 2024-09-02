import prisma from 'lib/prisma_master';

export const getAllCurrencyList = () => {
  return prisma.Currency.findMany({
    orderBy: {
      CurrencyCode: 'asc',
    },
  });
};
