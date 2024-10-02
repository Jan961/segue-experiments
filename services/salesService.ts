import getPrismaClient from 'lib/prisma';
import { NextApiRequest } from 'next';

export const getSaleTypeOptions = async (req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  const holdTypeOptions = prisma.holdType.findMany({});
  const saleTypeOptions = prisma.saleType.findMany({});
  const compTypeOptions = prisma.compType.findMany({});
  return Promise.all([holdTypeOptions, saleTypeOptions, compTypeOptions]).then(([holdTypes, saleTypes, compTypes]) => ({
    holdTypes,
    saleTypes,
    compTypes,
  }));
};
