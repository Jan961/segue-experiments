import prisma from 'lib/prisma';

export const getDayTypes = async () =>
  prisma.dateType.findMany({
    orderBy: {
      SeqNo: 'asc',
    },
  });
