import getPrismaClient from 'lib/prisma';
import { NextApiRequest } from 'next';

export const getContractStatus = async (ProductionId: number, req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  let where = {};
  if (ProductionId) {
    where = {
      DateBlock: {
        ProductionId,
      },
    };
  }

  return prisma.booking.findMany({
    where,
    include: {
      Contract: true,
    },
  });
};

export const getContractDealMemo = async (ProductionId: number, req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);

  let where = {};
  if (ProductionId) {
    where = {
      DateBlock: {
        ProductionId,
      },
    };
  }

  return prisma.booking.findMany({
    where,
    include: {
      DealMemo: true,
    },
  });
};
