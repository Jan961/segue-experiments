import prisma from 'lib/prisma';

export const getMasterTasksList = async (AccountId: number) => {
  return await prisma.masterTask.findMany({
    where: {
      AccountId,
    },
  });
};

export const getMaxTaskCode = async () => {
  return await prisma.masterTask.findFirst({
    orderBy: {
      Code: 'desc',
    },
    select:{
        Code: true,
    }
  });
};
