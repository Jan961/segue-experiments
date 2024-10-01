import getPrismaClient from 'lib/prisma';
import { NextApiRequest } from 'next';

export const getDateBlockForProduction = async (productionId: number, isPrimary: boolean, req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  return prisma.dateBlock.findMany({
    where: {
      ProductionId: productionId,
      ...(isPrimary && { IsPrimary: isPrimary }),
    },
  });
};

export const deleteAllDateBlockEvents = async (dateBlockID: number, tx) => {
  if (dateBlockID) {
    // important to Check DateBlockID is not null
    await tx.Booking.deleteMany({
      where: {
        DateBlockId: { equals: dateBlockID },
      },
    });

    await tx.Rehearsal.deleteMany({
      where: {
        DateBlockId: { equals: dateBlockID },
      },
    });

    await tx.GetInFitUp.deleteMany({
      where: {
        DateBlockId: { equals: dateBlockID },
      },
    });

    await tx.Other.deleteMany({
      where: {
        DateBlockId: { equals: dateBlockID },
      },
    });
  }
};
