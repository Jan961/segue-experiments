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
