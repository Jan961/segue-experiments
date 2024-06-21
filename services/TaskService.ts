import prisma from 'lib/prisma';

export const getMasterTasksList = async (AccountId: number) => {
  return await prisma.masterTask.findMany({
    where: {
      AccountId,
    },
    orderBy: {
      StartByWeekNum: 'asc',
    },
  });
};

export const getMaxTaskCode = async () => {
  return await prisma.masterTask.findFirst({
    orderBy: {
      Code: 'desc',
    },
    select: {
      Code: true,
    },
  });
};

export const getMaxProductionTaskCode = async (prodId: number) => {
  return await prisma.ProductionTask.findFirst({
    where: { ProductionId: prodId },
    orderBy: {
      Code: 'desc',
    },
    select: {
      Code: true,
    },
  });
};
