import prisma from 'lib/prisma';

export const getContractStatus = async (ProductionId: number) => {
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

export const getContractDealMemo = async (ProductionId: number) => {
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

export const getAllContractStatus = async () => {
  return prisma.booking.findMany({
    include: {
      Contract: true,
    },
  });
};
