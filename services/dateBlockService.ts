import prisma from 'lib/prisma';
export const getDateBlockForProduction = async (productionId: number, isPrimary: boolean) => {
  return prisma.dateBlock.findMany({
    where: {
      ProductionId: productionId,
      ...(isPrimary && { IsPrimary: isPrimary }),
    },
  });
};

export const deleteAllDateBlockEvents = async (dateBlockID: number) => {
  await prisma.Booking.deleteMany({
    where: {
      DateBlockId: { equals: dateBlockID },
    },
  });

  await prisma.Rehearsal.deleteMany({
    where: {
      DateBlockId: { equals: dateBlockID },
    },
  });

  await prisma.GetInFitUp.deleteMany({
    where: {
      DateBlockId: { equals: dateBlockID },
    },
  });

  await prisma.Other.deleteMany({
    where: {
      DateBlockId: { equals: dateBlockID },
    },
  });
};
