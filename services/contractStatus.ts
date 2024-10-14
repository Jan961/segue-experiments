import getPrismaClient from 'lib/prisma';
import { NextApiRequest } from 'next';

export const getContractStatus = async (ProductionId: number, req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  return prisma.booking.findMany({
    where: {
      DateBlock: {
        ProductionId,
      },
    },
    include: {
      Contract: true,
    },
  });
};

export const getContractDealMemo = async (ProductionId: number, req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  return prisma.booking.findMany({
    where: {
      DateBlock: {
        ProductionId,
      },
    },
    include: {
      DealMemo: true,
    },
  });
};

export const getAllContractStatus = async (req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  return prisma.booking.findMany({
    include: {
      Contract: true,
    },
  });
};

export const getAllContractDealMemo = async (req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  return prisma.booking.findMany({
    include: {
      DealMemo: true,
    },
  });
};
