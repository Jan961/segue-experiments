import prisma from 'lib/prisma';

export const getAllCurrencyList = () => {
  return prisma.Currency.findMany({
    orderBy: {
      Code: 'asc',
    },
  });
};
