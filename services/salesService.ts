import prisma from 'lib/prisma';

export const getSaleTypeOptions = async () => {
  const holdTypeOptions = prisma.HoldType.findMany({});
  const saleTypeOptions = prisma.SaleType.findMany({});
  const compTypeOptions = prisma.CompType.findMany({});
  return Promise.all([holdTypeOptions, saleTypeOptions, compTypeOptions]).then(([holdTypes, saleTypes, compTypes]) => ({
    holdTypes,
    saleTypes,
    compTypes,
  }));
};
