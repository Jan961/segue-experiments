import prisma from 'lib/prisma';
export const getDateBlockForProduction = async (productionId: number, isPrimary: boolean) => {
  return await prisma.dateBlock.findMany({
    where: {
      ProductionId: productionId,
      ...(isPrimary && { IsPrimary: isPrimary }),
    },
  });
};
