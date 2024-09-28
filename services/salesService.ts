import getPrismaClient from 'lib/prisma';
import { NextApiRequest } from 'next';

export const getSaleTypeOptions = async (req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  const holdTypeOptions = prisma.HoldType.findMany({});
  const saleTypeOptions = prisma.SaleType.findMany({});
  const compTypeOptions = prisma.CompType.findMany({});
  return Promise.all([holdTypeOptions, saleTypeOptions, compTypeOptions]).then(([holdTypes, saleTypes, compTypes]) => ({
    holdTypes,
    saleTypes,
    compTypes,
  }));
};
